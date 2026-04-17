const bcrypt = require('bcryptjs');

const password = 'password';
const hash = '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW';

console.log('测试密码:', password);
console.log('哈希值:', hash);

bcrypt.compare(password, hash).then(result => {
  console.log('密码匹配:', result);

  // 生成新的哈希
  bcrypt.hash(password, 10).then(newHash => {
    console.log('新哈希值:', newHash);
  });
});
