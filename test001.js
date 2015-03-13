
Pics = new Mongo.Collection('pics');

if (Meteor.isClient) {

  Template.list.events({

    'click .delpic': function(e,t){
      var id = e.target.getAttribute('id');
      Pics.remove({_id:id});
    }


  });

  Template.opt.events({
    
    'click .pai': function () {
    	MeteorCamera.getPicture(function(e,r){
    		if (e){
    			alert(e.message);
    		}
    		else {
    			var _id = Pics.insert({time:new Date(),pic:r,url:""});

          resAry = r.split(';');
          var mimeAry = resAry[0].split(':');
          var mime = mimeAry[1];

          var base64Ary = resAry[1].split(',');
          var base64 = base64Ary[1];

    			var qiniu = Object.create(QINIU);
          var fname = Math.round(new Date().getTime())+'.jpg';
          var upToken = qiniu.makeUploadToken(fname);
          //alert(upToken);

          qiniu.UploadBase64(upToken,base64,mime,fname,_id);
    		}
    	});
    }


  });

  Template.list.helpers({

  	pics : function(){
  		return Pics.find({url:{$not:""}},{sort: {time: -1}});
  	}

  });
}






