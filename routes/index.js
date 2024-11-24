const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const PORT = 5439;
const multer = require('multer');

// 配置文件上传路径
const upload = multer({ dest: 'uploads/' }); // 临时存储在 'uploads/' 目录

const xlsx = require('xlsx');
const fs = require('fs');

// 创建数据库连接
var connection = mysql.createConnection({
  host: '112.124.65.59',
  port: '3306',
  user: 'cyt',
  password: 'AbjhTs8xMLrZDs4j',
  database: 'cyt'
});

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// 创建联系人表
app.post('/create-table', (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone1 VARCHAR(20) NOT NULL,
        phone2 VARCHAR(20),
        email1 VARCHAR(100) NOT NULL,
        email2 VARCHAR(100),
        address VARCHAR(255),
        is_favorite BOOLEAN DEFAULT false
    );
  `;

  connection.query(createTableQuery, (err, results) => {
    if (err) return res.status(500).send('Error creating table');
    res.send('Contacts table created or already exists');
  });
});

// 添加联系人
app.post('/contacts', (req, res) => {
  console.log(req.body)
  const { name, phone1, phone2, email1, email2, address } = req.body;
  console.log(name, phone1, phone2, email1, email2, address)
  // 验证至少填写一个电话号码和一个邮箱
  const hasPhone = phone1 || phone2;
  const hasEmail = email1 || email2;

  if (!name || !hasPhone || !hasEmail || !address) {
    return res.status(400).send('请确保填写姓名、至少一个电话号码和至少一个邮箱。');
  }

  const sqlInsert = 'INSERT INTO contacts (name, phone1, phone2, email1, email2, address, is_favorite) VALUES (?, ?, ?, ?, ?, ?, 0)';
  console.log(sqlInsert)
  connection.query(sqlInsert, [name, phone1, phone2, email1, email2, address], (err, results) => {
    // res.end(results)
    if (err) return res.status(500).send('Error inserting contact');
    res.status(201).send('Contact added successfully');
  });
});

// 导出联系人到 Excel
app.get('/contacts/export', (req, res) => {
  const sqlSelect = 'SELECT * FROM contacts';
  connection.query(sqlSelect, (err, results) => {
    if (err) return res.status(500).send('Error fetching contacts for export');

    const ws = xlsx.utils.json_to_sheet(results);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Contacts');
    const filePath = './contacts.xlsx';
    xlsx.writeFile(wb, filePath);
    res.download(filePath, 'contacts.xlsx', () => {
      fs.unlinkSync(filePath);
    });
  });
});

// 导入联系人从 Excel
app.post('/contacts/import', upload.single('file'), (req, res) => {
  const filePath = req.file?.path; // 获取上传的文件路径
  if (!filePath) {
    return res.status(400).send('未选择文件或文件无效'); // 如果文件未上传
  }

  let successCount = 0; // 成功记录数
  let failureCount = 0; // 失败记录数

  try {
    const workbook = xlsx.readFile(filePath); // 使用 xlsx 读取 Excel 文件
    const sheet = workbook.Sheets[workbook.SheetNames[0]]; // 获取第一个工作表
    const contacts = xlsx.utils.sheet_to_json(sheet); // 将表格数据转换为 JSON 格式

    const promises = contacts.map((contact) => {
      return new Promise((resolve) => {
        const { name, phone1, phone2, email1, email2, address } = contact;

        // 验证数据有效性
        if (!name || (!phone1 && !phone2) || (!email1 && !email2)) {
          failureCount++;
          return resolve(); // 跳过无效数据
        }

        // 插入数据库
        const sqlInsert = `
                  INSERT INTO contacts (name, phone1, phone2, email1, email2, address)
                  VALUES (?, ?, ?, ?, ?, ?)
              `;
        connection.query(sqlInsert, [name, phone1, phone2, email1, email2, address], (err) => {
          if (err) {
            console.error('插入联系人失败:', err);
            failureCount++;
          } else {
            successCount++;
          }
          resolve();
        });
      });
    });

    Promise.all(promises).then(() => {
      fs.unlinkSync(filePath); // 删除上传的临时文件
      res.send(`联系人导入成功: ${successCount} 条, 失败: ${failureCount} 条`);
    });
  } catch (error) {
    console.error('文件解析失败:', error);
    res.status(500).send('文件解析失败');
  }
});




// 获取所有联系人
app.get('/contacts', (req, res) => {
  const sqlSelect = 'SELECT * FROM contacts';
  connection.query(sqlSelect, (err, results) => {
    if (err) return res.status(500).send('Error fetching contacts');
    res.json(results);
  });
});

// 获取收藏联系人
app.get('/contacts/favorites', (req, res) => {
  const sqlSelect = 'SELECT * FROM contacts WHERE is_favorite = true';
  connection.query(sqlSelect, (err, results) => {
    if (err) return res.status(500).send('Error fetching favorite contacts');
    res.json(results);
  });
});

// 删除联系人
app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const sqlDelete = 'DELETE FROM contacts WHERE id = ?';

  connection.query(sqlDelete, [id], (err, results) => {
    if (err) return res.status(500).send('Error deleting contact');
    res.send('Contact deleted successfully');
  });
});

// 删除所有联系人
app.post('/contacts/da', (req, res) => {
  const sqlAllDelete = 'TRUNCATE TABLE contacts';
  connection.query(sqlAllDelete, (err, results) => {
    if (err) return res.status(500).send('Error deleting all contacts');
    res.send('All contacts deleted successfully');
  });
});

// 编辑联系人
app.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone1, phone2, email1, email2, address, is_favorite } = req.body;

  const sqlUpdate = `
    UPDATE IGNORE contacts
    SET 
      name = ?, 
      phone1 = ?, 
      phone2 = ?, 
      email1 = ?, 
      email2 = ?, 
      address = ?, 
      is_favorite = ?
    WHERE id = ?
  `;

  connection.query(sqlUpdate, [name, phone1, phone2, email1, email2, address, is_favorite, id], (err, results) => {
    if (err) return res.status(500).send('Error updating contact');
    if (results.affectedRows === 0) return res.status(404).send('Contact not found');
    res.send('Contact updated successfully');
  });
});

// 收藏/取消收藏联系人
app.post('/contacts/:id/favorite', (req, res) => {
  const { id } = req.params;
  const sqlUpdate = 'UPDATE IGNORE contacts SET is_favorite = true WHERE id = ?';

  connection.query(sqlUpdate, [id], (err, results) => {
    if (err) return res.status(500).send('Error marking contact as favorite');
    if (results.affectedRows === 0) return res.status(404).send('Contact not found');
    res.send('Contact marked as favorite');
  });
});

app.delete('/contacts/:id/favorite', (req, res) => {
  const { id } = req.params;
  const sqlUpdate = 'UPDATE IGNORE contacts SET is_favorite = false WHERE id = ?';

  connection.query(sqlUpdate, [id], (err, results) => {
    if (err) return res.status(500).send('Error unmarking contact as favorite');
    if (results.affectedRows === 0) return res.status(404).send('Contact not found');
    res.send('Contact unmarked as favorite');
  });
});