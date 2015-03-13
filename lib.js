// function makeToken(filename){
// 	var putPolicy = '{"scope":"'+NIQIU_BUCKEET+':'+filename+'","deadline":1451491200,"returnBody":"{\"name\":$(fname),\"size\":$(fsize),\"w\":$(imageInfo.width),\"h\":$(imageInfo.height),\"hash\":$(etag)}"}';
// 	return CryptoJS.enc.Base64.stringify(putPolicy);
// }

QINIU = {


	safe64 : function(base64) {
        base64 = base64.replace(/\+/g, "-");
        base64 = base64.replace(/\//g, "_");
        return base64;
    },

	makeUploadToken:function(filename){
		var deadline = Math.round(new Date().getTime() / 1000) + 1 * 3600;
		var putPolicy = '{"scope":"'+QINIU_BUCKET+':'+filename+'","deadline":'+deadline+'}';
		var encodedPutPolicy = this.safe64(Base64.encode(putPolicy));
		var hash = CryptoJS.HmacSHA1( encodedPutPolicy , QINIU_SECRET_KEY);
		var encodedSign = this.safe64( hash.toString(CryptoJS.enc.Base64) );

		//console.log("putPolicy:"+putPolicy);
		//console.log("encodedPutPolicy:"+encodedPutPolicy);
		//console.log("encodedSign:"+encodedSign);



		return QINIU_ACCESS_KEY + ':' + this.safe64(encodedSign) + ':' + encodedPutPolicy;
	},

	UploadBase64:function(upToken,base64,mime,filename,id){
		var filename = this.safe64(Base64.encode(filename));
		
		// console.log("Base64:"+base64);

		HTTP.call(
			"POST",
			QINIU_UP_HOST+'-1/key/'+filename+'/mimeType/'+this.safe64(Base64.encode(mime))+'/',
			{headers:{"Content-Type":"application/octet-stream","Authorization":"UpToken "+upToken},content:base64},
			function(err,res){
				//res.data.key
				Pics.update( {"_id":id} , {$set:{"url":QINIU_PUBLIC_HOST+res.data.key}} );
			}
		);

		// var xhr = new XMLHttpRequest();
		
		// xhr.onreadystatechange=function(){
		// 	if (xhr.readyState==4){
		// 		console.log(xhr);
		// 	}
		// }
		// xhr.open("POST", QINIU_UP_HOST+'-1/key/'+filename+'/mimeType/'+this.safe64(Base64.encode(mime))+'/', true); 
		// xhr.setRequestHeader("Content-Type", mime); 
		// xhr.setRequestHeader("Authorization", "UpToken "+upToken); 
		// xhr.send(base64);

	}

};

