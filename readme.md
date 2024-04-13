# File upload using multer and cloudinary

## use --> https://github.com/expressjs/multer

## Steps

- Step 1: Require Multer and Cloudinary
- Step 2: Define Disk Storage
- Step 3: Initialize Multer with Storage Configuration
- Step 4: Use Upload Middleware in Route Handler
- Step 5: Upload File to Cloudinary
- Step 6: Delete File from Local Server
- Step 7: Send Response to User

## Step 1: Require Multer and Cloudinary

```
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
```
## Step 2: Define Disk Storage

```
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, './uploads');
},
filename: function (req, file, cb) {
const uniquePrefix = Date.now() + '-' + Math.round(Math.random() \* 1E9);
cb(null, file.fieldname + '-' + uniquePrefix + file.originalname);
}
});
```
## Step 3: Initialize Multer with Storage Configuration

```
const upload = multer({ storage: storage });
```
## Step 4: Use Upload Middleware in Route Handler

```
app.post("/file/upload", upload.single('myFile'), async (req, res) => {

    // console.log("Request file:", req.file);
    const filePath = req.file.path;

    //? Step 5: Upload File to Cloudinary
    const result = await cloudinary.uploader.upload(filePath);
    // console.log("Cloudinary result:", result)
    console.log("Url of image:", result.secure_url);

    //? Step 6: Delete File from Local Server
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
        else console.log("Delete hogayi ha");
    });

    //? Step 7: Send Response to User
    res.json({
        msg: "file uploaded",
        url: result.secure_url
    });

});
```