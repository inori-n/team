const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const deleteAllButton = document.getElementById('deleteAllButton');
const updateButton = document.getElementById('updateButton');

let editContactId = null; // 用于跟踪正在编辑的联系人 ID

// 添加联系人
document.getElementById('updateButton').addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    if (editContactId) {
        // 如果在编辑模式下，发送更新请求
        fetch(`http://localhost:5439/contacts/${editContactId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, phone, email }),
        })
            .then(response => {
                if (!response.ok) throw new Error('更新联系人失败');
                return response.text();
            })
            .then(message => {
                alert(message);
                resetForm();
                loadContacts();
            })
            .catch(error => alert(error.message));
    }
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    if (editContactId) {
        // 如果在编辑模式下，发送更新请求
        fetch(`http://localhost:5439/contacts/${editContactId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, phone, email }),
        })
            .then(response => {
                if (!response.ok) throw new Error('更新联系人失败');
                return response.text();
            })
            .then(message => {
                alert(message);
                resetForm();
                loadContacts();
            })
            .catch(error => alert(error.message));
    } else {
        // 添加新联系人
        fetch('http://localhost:5439/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, phone, email }),
        })
            .then(response => {
                if (!response.ok) throw new Error('添加联系人失败');
                return response.text();
            })
            .then(message => {
                alert(message);
                resetForm();
                loadContacts();
            })
            .catch(error => alert(error.message));
    }
});

// 加载联系人
function loadContacts() {
    fetch('http://localhost:5439/contacts')
        .then(response => response.json())
        .then(contacts => {
            contactList.innerHTML = '';
            contacts.forEach(contact => {
                const li = document.createElement('li');
                li.textContent = `${contact.name} - ${contact.phone} - ${contact.email}`;

                // 添加编辑按钮
                const editButton = document.createElement('button');
                editButton.textContent = '编辑';
                editButton.onclick = () => editContact(contact);
                li.appendChild(editButton);

                // 添加删除按钮
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.onclick = () => deleteContact(contact.id);
                li.appendChild(deleteButton);

                contactList.appendChild(li);
            });
        })
        .catch(error => alert('加载联系人失败: ' + error.message));
}

// 编辑联系人
function editContact(contact) {
    document.getElementById('name').value = contact.name;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('email').value = contact.email;
    editContactId = contact.id; // 设置正在编辑的 ID
    updateButton.style.display = 'inline'; // 显示更新按钮
}

// 删除联系人
function deleteContact(id) {
    fetch(`http://localhost:5439/contacts/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) throw new Error('删除联系人失败');
            return response.text();
        })
        .then(message => {
            alert(message);
            loadContacts();
        })
        .catch(error => alert(error.message));
}

// 删除所有联系人
deleteAllButton.addEventListener('click', () => {
    fetch('http://localhost:5439/contacts/da', {
        method: 'POST',
    })
        .then(response => {
            if (!response.ok) throw new Error('删除所有联系人失败');
            return response.text();
        })
        .then(message => {
            alert(message);
            loadContacts();
        })
        .catch(error => alert(error.message));
});

// 重置表单
function resetForm() {
    contactForm.reset();
    editContactId = null; // 清空正在编辑的 ID
    updateButton.style.display = 'none'; // 隐藏更新按钮
}

// 初始加载联系人
loadContacts();
