
//brew install ffmpeg
//npm install @tensorflow/tfjs-node
//npm install @tensorflow-models/posenet
//npm install ffmpeg
const tf = require('@tensorflow/tfjs-node');
const posenet = require('@tensorflow-models/posenet');
const fs = require('fs');
const {
    createCanvas, Image
} = require('canvas')
const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

let poses = [];

var ffmpeg = require('ffmpeg');

//let video_name='demo.avi'
//let video_name='demo2.mp4'
let video_name = 'IMG_2008.mov'


async function posenetWrapper(video_name) {


    try {
        var process = new ffmpeg(video_name);
        process.then(function (video) {
            //console.log(video.metadata)
            // Callback mode
            fr = video.fnExtractFrameToJPG('frames', {
                //every_n_seconds : 1,
                start_time: 0,
                //duration_time:2,
                frame_rate: 24,
                //number : 180,
                //file_name : 'my_frame'
            }, function (error, files) {
                if (!error)
                    console.log("")
                //console.log('frames: ' + files);
            });
            console.log(fr)
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }

    /*
    
    const tryModel = async(img) => {
        //console.log('start');
        const net = await posenet.load();
        //console.log(img)
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const input = tf.browser.fromPixels(canvas);
        const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);
        //console.log(pose);
        let temp=[]
        for(const keypoint of pose.keypoints) {
            //console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
            temp=temp.concat(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`)
        }
        poses=poses.concat(temp);
        //console.log(poses)
        console.log('end');
    }
    */

    async function tryModel2(img, net, number) {

        //console.log(img)
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const input = tf.browser.fromPixels(canvas);
        const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);

        let temp = []
        for (const keypoint of pose.keypoints) {
            //console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
            temp = temp.concat(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`)
        }
        //poses=poses.concat(number);
        poses = poses.concat(temp);

    }

    var img_name

    async function tasks() {
        const net = await posenet.load();


        for (i = 1; i < 72; i++) {
            const img = new Image();
            img_name = 'frames/IMG_2008_' + i + '.jpg'
            //console.log(img_name)
            img.src = img_name;
            number = i
            await tryModel2(img, net, number);

        }
        //console.log(poses)


        let data = JSON.stringify(poses);
        fs.writeFileSync('save2.json', data);
        //console.log(poses)

    }


    tasks();
    return poses
}

const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

app.get('/poseAPI/:video', async (req, res) => {
    console.log(req.params.video)

    const http = require('https');
    const fs = require('fs');
    videourl="https://videotestvirtrum.s3.amazonaws.com/IMG_1998.mp4"
    dest="download2.mp4"
    
    /***
     * Download video from url
     * 
     * */
    const file = fs.createWriteStream(dest);
    const request = http.get(videourl, function(response) {
    response.pipe(file);
    });
    //senddata=JSON.stringify(await posenetWrapper(video_name))
    //console.log(senddata)
    video=dest
    console.log(video)
    //res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(await posenetWrapper(video)))
    //res.sendfile('save2.json'); 

})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
//posenetWrapper(video_name);


