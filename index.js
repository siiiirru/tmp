var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
  });

const Commnets = sequelize.define('Commnets', {
  content: {
    type: DataTypes.STRING,
    allowNull: false //공란도 받아 들일 것이냐?
  },

}, {
  // Other model options go here
});

(async() => { //await은 비동기
await Commnets.sync(); //동기화과정. sync는 await와 같이 붙음.
})();

// req.body 오는 값을 읽기 위해 적용
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// <%= %> 또는 <% %> 같이 html에서 js를 쓰기위한 ejs 라이브러리
app.set('view engine', 'ejs');

// index page
app.get('/', async function(req, res) { 
    const comments = await Commnets.findAll(); //커멘트의 모든데이터 읽어와서 코멘츠에 넣음
    res.render('index', { comments: comments }); //코멘츠를 변수로 보냄.
});

app.post('/create', async function(req, res) {
    console.log(req.body)
    const {content} = req.body //form태그에 있는 name="content"
    await Commnets.create({ content : content }); //create는 테이블에 한 행 추가.
    res.redirect('/')
});

app.post('/update/:id', async function(req, res) {
    const {content} = req.body
    const {id} = req.params //sqlite에서 알게모르게 첫행부터 1번으로 아이디를 제공함.
    await Commnets.update({ content: content }, {
    where: {
      id: id
    }
  });

    res.redirect('/')
});

app.post('/delete/:id', async function(req, res) {
    const {id} = req.params
    await Commnets.destroy({
    where: {
      id: id
    }
  });
    res.redirect('/')
});

app.listen(3000);
console.log('Server is listening on port 3000');
