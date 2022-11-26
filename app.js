var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');

// 引用linebot SDK
var linebot = require('linebot');

// lesson counts
const MAX_LESSON = 72;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var webhookRouter = require('./routes/webhook');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/linewebhook', webhookRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: '1542262923',
  channelSecret: '948ae2b5c686b6f06f381010f1321f8c',
  channelAccessToken: '91rCJ6zpvYhZW5PuJEMBcAEIUVueCbIb/ezRu/syfcAzu64uhWgdwSbqG8zJXkjdQqelAvAVNQi7OcwUQDkjJ3RI8oCLLXqtgSzW6TgTJH/ePfKobmMuecEj3pQgHyJ0fwiuJzKnKPuB4dv9jAFX/gdB04t89/1O/w1cDnyilFU='
});



// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
  // handle events separately
  handleEvent(event).then(function (data) {
    // 當訊息成功回傳後的處理
  }).catch(function (error) {
    console.log(error)
    // 當訊息回傳失敗後的處理
  });

});

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', 6677, function () {
  console.log('[BOT已準備就緒]');
});

// create a default echo  text message
const defaultEcho = {
  type: 'template',
  altText: 'altText',
  template: {
    type: 'buttons',
    title: 'Get a Lesson',
    text: '請點擊 [get] 來拿一句好話',
    defaultAction: {
      type: 'message',
      label: '[get]',
      text: '[get]'
    },
    actions: [
      {
        type: 'message',
        label: '[get]',
        text: '[get]'
      }
    ]
  }
};

// event handler
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      var message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source, event);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }
    // case 'postback':
    //   return handlePostback(event);
    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken, source, event) {

  switch (message.text) {
    default:
    case '[get]':
      // receiveMap[source.userId] = undefined;
      const rawdata = fs.readFileSync('lesson.json');
      const jsonData = JSON.parse(rawdata);

      var i = getRandomInt(MAX_LESSON);

      var ly = jsonData[i];
      var msg = textTemp(i +': ' + ly);

      return event.reply(msg);

      // event.message.text是使用者傳給bot的訊息
      // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
      // event.reply(event.message.text)
  }
}

const textTemp = (text) => {
  return { type: 'text', text };
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// listen on port
const port = process.env.PORT || 6677;
// app.listen(port, () => {
//   console.log(`listening on ${port}`);
// });

module.exports = app;
