// document.getElementById("displaytext").style.display = "none";

function searchPhoto()
{
  console.log("Inside searchPhoto!!!");
  var apigClient = apigClientFactory.newClient({
                     apiKey: "nj2136Kp877YoXGOnNnZV7egmPf778SN12pH8P3J"
        });

    var user_message = document.getElementById('note-textarea').value;
    console.log("user_message : ", user_message);

    var audio_transcript = document.getElementById('outputXX').innerHTML;
    
    if(audio_transcript != ""){
      console.log("audio_transcript is not null");
      user_message = audio_transcript;
    }

    console.log("user_message : ", user_message);
    var body = { };
    var params = {"query" : user_message};
    var additionalParams = {headers: {
    'Content-Type':"application/json"
  }};

    apigClient.searchGet(params, body , additionalParams).then(function(res){
        var data = {}
        var data_array = []
        resp_data  = res.data
        length_of_response = resp_data.length;
        if(length_of_response == 0)
        {
          document.getElementById("displaytext").innerHTML = "No Images Found !!!"
          document.getElementById("displaytext").style.display = "block";

        }

        resp_data.forEach( function(obj) {

            var img = new Image();
            img.src = "https://vc-album-b2.s3.amazonaws.com/"+obj;
            // img.setAttribute("class", "banner-img");
            // img.setAttribute("alt", "effy");
            document.getElementById("displaytext").innerHTML = "Images returned are : "
            document.getElementById("img-container").appendChild(img);
            document.getElementById("displaytext").style.display = "block";

          });
      }).catch( function(result){

      });

}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}



function uploadPhoto()
{
   // var file_data = $("#file_path").prop("files")[0];
   console.log("Inside uploadPhoto");
   var tags = document.getElementById('tags-textarea').value;
   console.log("tags : ", tags);
   var tag_array = tags.split(" ");
   console.log("tag_array : ", tag_array);

   var file = document.getElementById('file_path').files[0];
   const reader = new FileReader();

   var file_data;
   // var file = document.querySelector('#file_path > input[type="file"]').files[0];
   var encoded_image = getBase64(file).then(
     data => {
     console.log(data)
     var apigClient = apigClientFactory.newClient({
                       // apiKey: "QZyNutjpMiaCkLerrJ0Uj9ulUJ1siigx4zoRoL3x"
                       apiKey: "nj2136Kp877YoXGOnNnZV7egmPf778SN12pH8P3J"
          });

     console.log("Created apigClient");
     // var data = document.getElementById('file_path').value;
     // var x = data.split("\\")
     // var filename = x[x.length-1]
     var file_type = file.type;+ ";base64";

     console.log('file_type');
     console.log(file_type);
     var body = data;
     var params = {"file" : file.name, "x-amz-meta-customLabels" : tag_array, "Content-Type" : "application/json" };
     var additionalParams = {};
     apigClient.uploadPut(params, body , additionalParams).then(function(res){
       if (res.status == 200)
       {
         document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
         document.getElementById("uploadText").style.display = "block";
       }
     })
   });

}

function runSpeechRecognition() {
  console.log("Inside runSpeechRecognition()!!!!"); 
  // get output div reference

  var output = document.getElementById("outputXX");

  // var output = document.getElementById("note-textarea");
  // get action element reference
  var action = document.getElementById("action");
      // new speech recognition object
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      var recognition = new SpeechRecognition();
  
      // This runs when the speech recognition service starts
      recognition.onstart = function() {
          action.innerHTML = "<small>listening, please speak...</small>";
      };
      
      recognition.onspeechend = function() {
          action.innerHTML = "<small>stopped listening, hope you are done...</small>";
          recognition.stop();
      }
    
      // This runs when the speech recognition service returns result
      recognition.onresult = function(event) {
          var transcript = event.results[0][0].transcript;
          console.log("transcript : ", transcript);
          // var confidence = event.results[0][0].confidence;
          output.innerHTML = transcript; // + "<br/> <b>Confidence:</b> " + confidence*100+"%";
          // output.classList.remove("hide");
      };
    
       // start recognition
       recognition.start();
}