var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var log4js = require('log4js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();

log4js.configure({
  appenders: [
    { type: 'console' },{
      type: 'file',
      filename: 'logs/access.log',
      maxLogSize: 1024,
      backups:4,
      category: 'normal'
    }
  ],
  replaceConsole: true
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

var port = 8888;
var register = require('./routes/register');
var login = require('./routes/login');
var updateUser = require('./routes/updateUser');
var onlyQuery = require('./routes/onlyQuery');
var uploadSongs = require('./routes/uploadSongs');
var uploadArtistApi = require('./routes/uploadArtistApi');
var getSongByHotApi = require('./routes/getSongByHotApi');
var getSongByTimeApi = require('./routes/getSongByTimeApi');
var getMemberApi = require('./routes/getMemberApi');
var getRecArtistApi = require('./routes/getRecArtistApi');
var getHotArtistApi = require('./routes/getHotArtistApi');
var getUserByIdApi = require('./routes/getUserByIdApi');
var postFeedBackApi = require('./routes/postFeedBackApi');
var updateFeedBackApi = require('./routes/updateFeedBackApi');
var getFeedBackApi = require('./routes/getFeedBackApi');
var getProblemDetailsByIdApi = require('./routes/getProblemDetailsByIdApi');
var getSongInfoApi = require('./routes/getSongInfoApi');
var getArtistInfoApi = require('./routes/getArtistInfoApi');
var getSongByTypeApi = require('./routes/getSongByTypeApi');
var getArtistByTimeApi = require('./routes/getArtistByTimeApi');
var getArtistByTypeApi = require('./routes/getArtistByTypeApi');
var postCommentApi = require('./routes/postCommentApi');
var searchApi = require('./routes/searchApi');
var collectSongsApi = require('./routes/collectSongsApi');
var postCommentPraiseApi = require('./routes/postCommentPraiseApi');
var getUserUploadApi = require('./routes/getUserUploadApi');
var changePassword = require('./routes/changePassword');
var getAllCommentsApi = require('./routes/getAllCommentsApi');
var postArtistVisitApi = require('./routes/postArtistVisitApi');
var postSongListenerApi = require('./routes/postSongListenerApi');
var delMemberApi = require('./routes/delMemberApi');
var resetPwdApi = require('./routes/resetPwdApi');
var lockUserApi = require('./routes/lockUserApi');
var delSongApi = require('./routes/delSongApi');
var getSongByIdApi = require('./routes/getSongByIdApi');
var updateSongInfoApi = require('./routes/updateSongInfoApi');
var delArtistApi = require('./routes/delArtistApi');
var getArtistByIdApi = require('./routes/getArtistByIdApi');
var updateArtistInfoApi = require('./routes/updateArtistInfoApi');
var checkCommentApi = require('./routes/checkCommentApi');
var getCommentByIdApi = require('./routes/getCommentByIdApi');
var delCommentApi = require('./routes/delCommentApi');
var getTopListByTypeApi = require('./routes/getTopListByTypeApi');
var getTopListNewApi = require('./routes/getTopListNewApi');
var getTopListSoarApi = require('./routes/getTopListSoarApi');
var getTopListOriginalApi = require('./routes/getTopListOriginalApi');
var postPlayListApi = require('./routes/postPlayListApi');
var getPlayListApi = require('./routes/getPlayListApi');
var delAllPlayListApi = require('./routes/delAllPlayListApi');
var delPlayListApi = require('./routes/delPlayListApi');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',require('ejs').__express);//两个下划线
app.set( 'view engine', 'html' );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(multer());
//app.use(logger('dev'));

app.use(log4js.connectLogger(logger, {level: 'auto', format:':method :url'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'views')));

app.use(express.static(path.join(__dirname, 'allLoadFile')));

app.use('/www',express.static(path.join(__dirname, 'views/www')));

app.use('/', register);
app.use('/', login);
app.use('/', updateUser);
app.use('/', onlyQuery);
app.use('/', uploadSongs);
app.use('/', uploadArtistApi);
app.use('/', getSongByHotApi);
app.use('/', getSongByTimeApi);
app.use('/', getMemberApi);
app.use('/', getRecArtistApi);
app.use('/', getHotArtistApi);
app.use('/', getUserByIdApi);
app.use('/', postFeedBackApi);
app.use('/', updateFeedBackApi);
app.use('/', getFeedBackApi);
app.use('/', getProblemDetailsByIdApi);
app.use('/', getSongInfoApi);
app.use('/', getArtistInfoApi);
app.use('/', getSongByTypeApi);
app.use('/', getArtistByTimeApi);
app.use('/', getArtistByTypeApi);
app.use('/', postCommentApi);
app.use('/', searchApi);
app.use('/', collectSongsApi);
app.use('/', postCommentPraiseApi);
app.use('/', getUserUploadApi);
app.use('/', changePassword);
app.use('/', getAllCommentsApi);
app.use('/', postArtistVisitApi);
app.use('/', postSongListenerApi);
app.use('/', delMemberApi);
app.use('/', resetPwdApi);
app.use('/', lockUserApi);
app.use('/', delSongApi);
app.use('/', getSongByIdApi);
app.use('/', updateSongInfoApi);
app.use('/', delArtistApi);
app.use('/', getArtistByIdApi);
app.use('/', updateArtistInfoApi);
app.use('/', checkCommentApi);
app.use('/', getCommentByIdApi);
app.use('/', delCommentApi);
app.use('/', getTopListByTypeApi);
app.use('/', getTopListNewApi);
app.use('/', getTopListSoarApi);
app.use('/', getTopListOriginalApi);
app.use('/', postPlayListApi);
app.use('/', getPlayListApi);
app.use('/', delAllPlayListApi);
app.use('/', delPlayListApi);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port);
console.log('听见服务器已启动。'+'端口号：'+port);
module.exports = app;
