const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql'); // 确保安装了mysql模块
const app = express();
const PORT = 5439;

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
  const sqlCreateTable = `
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            email VARCHAR(100) NOT NULL
        );
    `;

  connection.query(sqlCreateTable, (err, results) => {
    if (err) return res.status(500).send('Error creating table');
    res.send('Contacts table created or already exists');
  });
});

// 添加联系人
app.post('/contacts', (req, res) => {
  const { name, phone, email } = req.body;
  const sqlInsert = 'INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)';

  connection.query(sqlInsert, [name, phone, email], (err, results) => {
    if (err) return res.status(500).send('Error inserting contact');
    res.status(201).send('Contact added successfully');
  });
});

// 获取联系人
app.get('/contacts', (req, res) => {
  const sqlSelect = 'SELECT * FROM contacts';
  console.log('获取联系人成功');
  connection.query(sqlSelect, (err, results) => {
    if (err) return res.status(500).send('Error fetching contacts');
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

// 删除整表
app.post('/contacts/da', (req, res) => {
  console.log("删除整表")
  const sqlAllDelete = 'TRUNCATE TABLE contacts';
  connection.query(sqlAllDelete, (err, results) => {
    if (err) return res.status(500).send('Error deleting All contact');
    res.send('Contact table deleted successfully');
  });
});

// 编辑联系人
app.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;
  const sqlUpdate = 'UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?';

  connection.query(sqlUpdate, [name, phone, email, id], (err, results) => {
    if (err) return res.status(500).send('Error updating contact');
    if (results.affectedRows === 0) return res.status(404).send('Contact not found');
    res.send('Contact updated successfully');
  });
});

module.exports = router;
