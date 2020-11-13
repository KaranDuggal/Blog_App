const ejs = require('ejs');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const port = process.env.PORT || 8000;
const app = express();


// connect to databass 
mongoose.connect('mongodb://localhost:27017/blog_app', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('connect successfully'))
    .catch((err) => console.log(err));

// set paths
const publicFile = path.join(__dirname, '../public');
const viewsFile = path.join(__dirname, '../templates/views');
const partialFile = path.join(__dirname, '../templates/partials');
app.set('view engine', 'ejs');
app.set('views', viewsFile);
app.use(express.static(publicFile));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// blog schema 
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {
        type: Date,
        default: Date.now
    }
});
const blog = mongoose.model('blog', blogSchema);

// Routes
app.get('/', (req, res) => {
    res.render('index');
});
// index route
app.get('/blogs', (req, res) => {
    blog.find({}, (err, blogs) => {
        try {
            res.render('blog', { blogs: blogs });
        } catch (err) {
            console.log(err);
        }
    })
});
// new route 
app.get('/blogs/new', (req, res) => {
    res.render('new');
});
// post route Add blog
app.post('/blogs', (req,res) => {
    const getData = async () => {
        var title = req.body.newTitle;
        var image = req.body.newImage;
        var body = req.body.newBody;
        try {
            const newBlog = new blog({
                title: title,
                image: image,
                body: body
            });
            const result = await newBlog.save();
            res.redirect("/blogs");
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }
    getData();
});
// Show Full dscription of blog 
app.get('/blogs/:id',(req,res)=>{
    blog.findById(req.params.id,(err, showblog)=>{
        try {
            res.render('show',{blog: showblog});
        } catch (err) {
            res.redirect('/blogs')
        }
    });
});
// update the blog 
app.get('/blogs/:id/edit', (req, res) => {
    blog.findById(req.params.id,(err, foundblog)=>{
        try {
            res.render('edit',{blog: foundblog})
        } catch (err) {
            res.redirect('/blogs');
        }
    })
});
// update route put request 
app.put('blogs/:id', (req, res) => {
    res.render('about');
});
// about 
app.get('/about', (req, res) => {
    res.render('about');
});


app.listen(port, () => {
    console.log(`lisening to the port number at ${port}`);
});