const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const favoriteList = document.getElementById('favoriteList');
const deleteAllButton = document.getElementById('deleteAllButton');
const updateButton = document.getElementById('updateButton');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');

let editContactId = null; // 用于跟踪正在编辑的联系人 ID

// 初始加载联系人
loadContacts();

// 更新联系人或添加新联系人
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone1 = document.getElementById('phone1').value;
    const phone2 = document.getElementById('phone2').value;
    const email1 = document.getElementById('email1').value;
    const email2 = document.getElementById('email2').value;
    const address = document.getElementById('address').value;

    // 验证至少填写一个电话号码和一个邮箱
    const hasPhone = phone1 || phone2;
    const hasEmail = email1 || email2;

    if (!name || (!hasPhone) || (!hasEmail)) {
        alert('请确保填写姓名、至少一个电话号码和至少一个邮箱和一个地址。');
        return;
    }

    if (editContactId) {
        // 更新联系人
        fetch(`http://121.199.30.193:5439/contacts/${editContactId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone1, phone2, email1, email2, address })
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
                resetForm();
                loadContacts();
            })
            .catch(error => alert(error.message));
    } else {
        // 添加新联系人
        fetch('http://121.199.30.193:5439/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone1, phone2, email1, email2, address })
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
// 加载所有联系人
function loadContacts() {
    fetch('http://121.199.30.193:5439/contacts')
        .then(response => response.json())
        .then(contacts => {
            contactList.innerHTML = '';
            contacts.forEach(contact => {
                const li = document.createElement('li');

                const contactContainer = document.createElement('div');
                contactContainer.classList.add('contact-container'); // 添加类以便于样式调整

                const nameDiv = document.createElement('div');
                nameDiv.textContent = contact.name;
                contactContainer.appendChild(nameDiv);

                const phoneDiv = document.createElement('div');
                phoneDiv.textContent = `电话: ${contact.phone1} /${contact.phone2 ? contact.phone2 : ''}`;
                contactContainer.appendChild(phoneDiv);

                const emailDiv = document.createElement('div');
                emailDiv.textContent = `邮箱: ${contact.email1} /${contact.email2 ? contact.email2 : ''}`;
                contactContainer.appendChild(emailDiv);

                const addressDiv = document.createElement('div');
                addressDiv.textContent = `地址: ${contact.address ? contact.address : ''}`;
                contactContainer.appendChild(addressDiv);

                // 创建按钮容器
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('button-container'); // 添加类以便于样式调整

                // 添加编辑按钮
                const editButton = document.createElement('button');
                editButton.textContent = '编辑';
                editButton.onclick = () => editContact(contact);
                buttonContainer.appendChild(editButton);

                // 添加删除按钮
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.onclick = () => deleteContact(contact.id);
                buttonContainer.appendChild(deleteButton);

                // 添加收藏/取消收藏按钮
                const favoriteButton = document.createElement('button');
                favoriteButton.textContent = contact.is_favorite ? '取消收藏' : '收藏';
                favoriteButton.onclick = () => toggleFavorite(contact);
                buttonContainer.appendChild(favoriteButton);

                // 将联系人信息和按钮容器添加到列表项
                contactContainer.appendChild(buttonContainer);
                li.appendChild(contactContainer);
                contactList.appendChild(li);
            });
            loadFavorites();  // 加载收藏联系人
        })
        .catch(error => alert('加载联系人失败: ' + error.message));
}


// 加载收藏联系人
function loadFavorites() {
    fetch('http://121.199.30.193:5439/contacts/favorites')  // 获取收藏联系人
        .then(response => response.json())
        .then(favorites => {
            favoriteList.innerHTML = '';
            favorites.forEach(contact => {
                const li = document.createElement('li');
                li.id = `contact-${contact.id}`; // 给每个联系人添加一个唯一的 ID

                // 创建姓名行
                const nameDiv = document.createElement('div');
                nameDiv.textContent = contact.name;
                li.appendChild(nameDiv);

                // 创建电话行
                const phoneDiv = document.createElement('div');
                phoneDiv.textContent = `电话: ${contact.phone1} /${contact.phone2 ? contact.phone2 : ''}`;
                li.appendChild(phoneDiv);

                // 创建邮箱行
                const emailDiv = document.createElement('div');
                emailDiv.textContent = `邮箱: ${contact.email1} /${contact.email2 ? contact.email2 : ''}`;
                li.appendChild(emailDiv);

                // 创建地址行
                const addressDiv = document.createElement('div');
                addressDiv.textContent = `地址: ${contact.address ? contact.address : ''}`;
                li.appendChild(addressDiv);

                // 修改联系人项字体大小
                modifyContactStyle(contact, li);

                // 创建按钮容器
                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('button-container'); // 添加类以便于样式调整

                // 添加编辑按钮
                const editButton = document.createElement('button');
                editButton.textContent = '编辑';
                editButton.onclick = () => editContact(contact);
                buttonContainer.appendChild(editButton);

                // 添加删除按钮
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.onclick = () => deleteContact(contact.id);
                buttonContainer.appendChild(deleteButton);

                // 添加取消收藏按钮
                const unfavoriteButton = document.createElement('button');
                unfavoriteButton.textContent = '取消收藏';
                unfavoriteButton.onclick = () => toggleFavorite(contact);
                buttonContainer.appendChild(unfavoriteButton);

                // 将按钮容器添加到列表项
                li.appendChild(buttonContainer);
                favoriteList.appendChild(li);
            });

        })
        .catch(error => alert('加载收藏联系人失败: ' + error.message));
}

// 修改联系人项字体大小
function modifyContactStyle(contact, liElement) {
    // 修改字体大小为 16px，您可以根据需要调整这个值
    liElement.style.fontSize = '18px'; // 设置字体大小

    // 如果你想根据某个条件动态改变字体大小，可以在这里增加判断
    if (contact.is_vip) {
        liElement.style.fontSize = '18px'; // VIP联系人字体大小为18px
    }
}

// 添加或取消收藏
function toggleFavorite(contact) {
    const url = `http://121.199.30.193:5439/contacts/${contact.id}/favorite`;
    const method = contact.is_favorite ? 'DELETE' : 'POST';  // 根据状态切换操作

    fetch(url, { method })
        .then(response => response.text())
        .then(message => {
            alert(message);
            loadContacts();  // 更新联系人列表
        })
        .catch(error => alert('操作失败: ' + error.message));
}

// 编辑联系人
function editContact(contact) {
    document.getElementById('name').value = contact.name;
    document.getElementById('phone1').value = contact.phone1;
    document.getElementById('phone2').value = contact.phone2 || '';
    document.getElementById('email1').value = contact.email1;
    document.getElementById('email2').value = contact.email2 || '';
    document.getElementById('address').value = contact.address || '';
    editContactId = contact.id;

    // 显示更新按钮并隐藏添加按钮
    updateButton.style.display = 'inline';
}
// 删除联系人
function deleteContact(id) {
    fetch(`http://121.199.30.193:5439/contacts/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.text())
        .then(message => {
            alert(message);
            loadContacts();  // 删除后重新加载联系人
        })
        .catch(error => alert(error.message));
}

// 删除所有联系人
deleteAllButton.addEventListener('click', () => {
    fetch('http://121.199.30.193:5439/contacts/da', {
        method: 'POST',
    })
        .then(response => response.text())
        .then(message => {
            alert(message);
            loadContacts();  // 删除所有联系人后重新加载
        })
        .catch(error => alert(error.message));
});

// 导出联系人
exportButton.addEventListener('click', () => {
    fetch('http://121.199.30.193:5439/contacts/export')
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'contacts.xlsx';
            link.click();
        })
        .catch(error => alert('导出失败: ' + error.message));
});


// 点击导入按钮时打开文件选择器
importButton.addEventListener('click', () => {
    importInput.click(); // 模拟点击文件选择器
});

// 文件选择后发送到后端
importInput.addEventListener('change', async (e) => {
    const file = e.target.files[0]; // 获取选中的文件
    if (!file) {
        alert('请选择一个文件'); // 提示用户选择文件
        return;
    }

    const formData = new FormData();
    formData.append('file', file); // 将文件添加到表单数据中

    try {
        // 调用后端接口上传文件
        let url = "http://121.199.30.193:5439/contacts/import"
        const response = await fetch(url, {
            method: 'POST',
            body: formData, // 使用 FormData 发送文件
        });

        if (!response.ok) {
            throw new Error('导入联系人失败'); // 如果服务器响应失败，抛出错误
        }

        const message = await response.text();
        alert(message); // 显示服务器返回的消息
        loadContacts(); // 刷新联系人列表
    } catch (error) {
        alert('导入失败: ' + error.message); // 显示错误信息
    } finally {
        importInput.value = ''; // 清空文件选择器状态，允许重复选择同一个文件
    }
});


// 重置表单
function resetForm() {
    contactForm.reset();
    editContactId = null;
    updateButton.style.display = 'none';
}