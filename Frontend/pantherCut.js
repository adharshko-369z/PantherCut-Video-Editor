const uploadBtn = document.getElementById('uploadFileButton')
const inputFiles = document.getElementById('inputFiles')
const fileList = document.getElementById('fileList')


// function upload button

uploadBtn.addEventListener('click', () =>{
    inputFiles.click();
});

inputFiles.addEventListener('change',()=>{
    fileList.innerHTML="";


const files=Array.from(inputFiles.files);

files.forEach((file) =>{
   const url = URL.createObjectURL(file);
   const box = document.createElement("div");
   box.classList.add("thumbnailBox");

//    drag-file-set
    box.setAttribute("draggable",true);
    box.addEventListener("dragstart", (e)=>{
        e.dataTransfer.setData("type",file.type);
        e.dataTransfer.setData("url",url);
    });


// if(file.type.startsWith('image')){
//     const img = document.createElement("img");
//     img.src = url;
//     box.appendChild(img);
// }else 
    if (file.type.startsWith("video")){
    const video = document.createElement("video");
    video.src = url;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    box.appendChild(video);
}
// else if (file.type.startsWith("audio")){
//     const audio = document.createElement("audio");
//     audio.src = url;
//     audio.controls = false;
//     box.style.aspectRatio = 'auto';
//     box.style.height='40px';
//     box.appendChild(audio);
// }

fileList.appendChild(box);

});


});

// drag-file-into-track

const videoTrack = document.getElementById("videoTrack");
const trackMessage = document.getElementById("trackMessage");

videoTrack.addEventListener("dragover",(e) =>{
    e.preventDefault();
    videoTrack.style.backgroundColor = "#444";
});

videoTrack.addEventListener("dragleave", () =>{
    videoTrack.style.backgroundColor = "#2A2A2A";
});

videoTrack.addEventListener("drop", (e) =>{
    e.preventDefault();

    const url = e.dataTransfer.getData("url");
    const type = e.dataTransfer.getData("type");
// remove message
    if(!url || !type) return;

    if(trackMessage) trackMessage.remove();

    
    // const trackBox = document.createElement("div");
    // trackBox.classList.add("trackItem");

    // if (type.startsWith("image")){
    //     const img = document.createElement("img");
    //     img.src = url;
    //     trackBox.appendChild(img);
    // } else 
    if (type.startsWith("video")){
        const video = document.createElement("video");
        video.src = url;
        

        video.addEventListener("loadedmetadata",() =>{
            const duration = video.duration ||1;
            console.log("video loded:",duration);

            const scale=40;
            const visualWidth=duration*scale;
            
            const trackBox=document.createElement("div");
            trackBox.classList.add("trackItem");
            trackBox.style.width=`${visualWidth}px`;
            // trackBox.style.height = `${visualHeight}px`;
            trackBox.style.height='10vh';
            trackBox.style.backgroundColor="#555";

            // const frameCount= Math.min(Math.floor(duration),100);
            

            const thumbHeight = videoTrack.clientHeight;
            const thumbWidth = Math.floor(thumbHeight*16/9);
            console.log("thumbSize", thumbWidth,thumbHeight);
            const frameCount= Math.floor(visualWidth/thumbWidth);
            console.log("frameCount",frameCount);
          

            


            const canvas = document.createElement("canvas");
            canvas.width = thumbWidth;
            canvas.height = thumbHeight;
            const ctx = canvas.getContext("2d");

            

            const clone = video.cloneNode(true);
            clone.muted = true;
            clone.playsInline = true;
            clone.style.position = "absolute";
            clone.style.left = "-9999px";
            document.body.appendChild(clone);   
            console.log("clone appended",clone);

            const seekTo = (time) =>{
                return new Promise(resolve =>{
                  
                    clone.onseeked = () => {
                        clone.removeEventListener('seeked',onseeked);
                        resolve();
                    };
                    clone.addEventListener('seeked',onseeked);
                    clone.currentTime = time;
                });
            };

            clone.addEventListener("loadeddata",async () =>{
                for (let i=0;i<=frameCount;i++){
                    await seekTo((i/frameCount)*duration);
                    console.log("Drawing frame:",i,"time:",(i/frameCount)*duration);
                    ctx.drawImage(clone,0,0,clone.videoWidth || 1280,clone.videoHeight || 720,i*thumbWidth,0,thumbWidth,thumbHeight);

                    const thumbURL = canvas.toDataURL("image/png");
                    const img=document.createElement("img");
                    img.src= thumbURL;
                    img.width=thumbWidth;
                    img.height=thumbHeight;
                    img.style.flexShrink="0";
                    trackBox.appendChild(img);
                }
                clone.remove();
            });
           
            const stripURL = canvas.toDataURL("image/png");
            console.log("canvas ready.strip URL:",stripURL.slice(0,100));
            trackBox.style.backgroundImage = `url(${stripURL})`;
            trackBox.style.backgroundRepeat = "repeat-x";
            trackBox.style.backgroundSize = `${thumbWidth}px ${thumbHeight}px`;
            videoTrack.appendChild(trackBox);




            // playhead Setup

            // const playhead = document.getElementById("playhead");
            // const track = document.querySelector(".videoTrackSection");

            // let isDragging = false;

            // playhead.addEventListener("mousedown",() =>{
            //     isDragging = true;
            // });

            // document.addEventListener("mouseup", () =>{
            //     isDragging = false;
            // });

            // document.addEventListener("mousemove", (e) =>{
            //     if(!isDragging) return;

            //     const trackRect = track.getBoundingClientRect();
            //     let newLeft = e.clientX - trackRect.left + track.scrollLeft;

            //     const maxScroll = track.scrollWidth;

            //     const clamepdX = Math.max(0,Math.min(newLeft,maxScroll));
                
            //     playhead.style.left = clamepdX + "px";
            // });

            
        });

        
        
    }
    
    
});





