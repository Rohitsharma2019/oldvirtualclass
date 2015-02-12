/* function library*/

// this should be removed
//counter = 0;
//idList = new Array();
//vApp.chat.chatroombox = null;



function memberUpdate(e, addType){
    var userlist = e.message;
    if(typeof whiteboardPath === 'undefined'){
        var imgpath = "../images/online.png";
    }else{
        var imgpath = window.whiteboardPath+"images/online.png"; //image folder path
    }
    if(userlist.length > 0){
                //changed by suman
        var count = userlist.length - 1;
        //var count = userlist.length;
        
        ///vApp.gObj.totalUser = count;
        vApp.gObj.totalUser = [];
        for(var i=0; i<userlist.length; i++){
            vApp.gObj.totalUser.push(userlist[i].id);
        }
        vApp.gObj.totalUser.sort();
        
        $("#user_list .inner_bt #usertab_icon").css({'background': 'url(' + imgpath + ')no-repeat top left'});
    }

    $("#user_list .inner_bt #usertab_text").text(lang.whos + " (" + count + ")");
    $("#chatroom_bt .inner_bt #chatroom_text").text(lang.chatroom + " (" + count + ")");
    //if (userlist.length > 1) {
    //changed by suman
//    if(typeof addType != 'undefined'){
//        if(addType == 'removed'){
//            return true;
//        }
//
//    }    
    if (userlist.length > 0) {
        if (!document.getElementById('chat_div')) { // prevent creating div on each update
            var cd = document.createElement('div');
            cd.id = 'chat_div';
            document.body.appendChild(cd);

        }

        $("#chat_div").memberlist({
            id:"chat_div",
            user:userlist,
            offset:'7px',
            title : lang.online,
            userSent : function(user) {
                $("#chat_div").memberlist("option", "boxManager").addUsr(user);
            }
        });
        
        $( '#chat_div .ui-memblist-usr:not(.mySelf)').remove();
        $.each(userlist, function(key, usr) {
            //alert('userId ' +  usr.userid);
            if(document.getElementById('video'+usr.userid) == null){
                $("#chat_div").memberlist("option").userSent(usr);
            }
            
            
            if (usr.userid == io.cfg.userid && typeof addType != 'undefined' && addType != 'removed') {

                    var vidTag = document.getElementById('video'+usr.userid);
                    if(vidTag == null ){
                        vApp.gObj.video._handleUserMedia(usr.userid);
                    }
                        
//                    }
                    
//                }
                
                //vApp.gObj.video._handleUserMedia(usr.userid);
            }
            vApp.gObj.video.addUserRole(usr.userid, usr.role);
        });
        
    }else{
        /* when there is one user and left the chat
            remove userlist box
        */
        if($('div#memlist').length){
            $("div#memlist").remove();
        }
    }
}



/*
    Called on new message arival
    update msg list in chatbox
*/

function messageUpdate(e){
    
    if($.isPlainObject(e.message)){
        var msg = e.message.msg;
    }else{
        var msg = e.message;
    }

    var to = e.toUser;
    var from = e.fromUser;
    var self = io.cfg.userid;
    var time = new Date().getTime();
    //common chat room
    if( e.message.receiver == 'chatroom' && (to == "" || to == undefined)){
        if(self == from.userid){
            $("#chat_room").chatroom("option").messageSent(from, msg);
        }else{
            if(vApp.chat.chatroombox) {
                $("#chat_room").chatroom("option").messageSent(from, msg);
            }else{
               if($("div#chat_room").length == 0){
                    var d = document.createElement('div');
                    d.id = 'chat_room';
                    document.body.appendChild(d);
                    vApp.chat.chatroombox = $("#chat_room").chatroom({id:"chat_room",
                                            user : from,
                                            title : lang.chatroom_header,
                                            messageSent : function(user, msg) {
                                                $("#chat_room").chatroom("option", "boxManager").addMsg(user.name,msg);
                                            }});
               }
               $("#chat_room").chatroom("option").messageSent(from, msg);
               }
            }

            // store data on browser
            if(sessionStorage.getItem('chatroom') != null){
                var chatroom = JSON.parse(sessionStorage.getItem('chatroom'));
                var temp = { userid:from.userid,name:from.name, msg: msg,time: time}
                chatroom.push(temp);
                sessionStorage.setItem('chatroom',JSON.stringify(chatroom));
            } else {
                sessionStorage.setItem('chatroom', JSON.stringify([{ userid:from.userid,name:from.name , msg: msg,time: time}]));
            }

    }else if(to != undefined && to != ""){ // private chat

        if(self == to.userid && from.userid != self){
//            if($.inArray(from.userid, idList) == -1){
//                counter++;
//                idList.push(from.userid);
            if($.inArray(from.userid, vApp.chat.idList) == -1){
                vApp.chat.counter++;
                vApp.chat.idList.push(from.userid);
                
                if(typeof from.lname == 'undefined'){
                    alert("hello guys");
                    debugger;
                }
                vApp.chat.vmstorage[from.userid] = [];
                vApp.chat.vmstorage[from.userid].push({ userid:from.userid, name:from.name + ' ' + from.lname});
            }
                chatboxManager.addBox(from.userid,
                          {dest:"dest" + vApp.chat.counter, // not used in demo
                           title:"box" + vApp.chat.counter,
                           first_name:from.name,
                           last_name:from.lname
                           //you can add your own options too
                          });

            var did = from.userid;

            chatboxManager.init({
                user:from,
                messageSent : function(did,user,msg){
                    $("#" + did).chatbox("option", "boxManager").addMsg(user.name, msg);
                }});
            
            var chEnable = localStorage.getItem('chatEnable');
            //bad way to check chatEnable
            if(chEnable != null && chEnable == 'false'){
                vApp.user.control.allChatDisable();

//                vApp.user.allChatDisable();
            }
            
            $("#" + from.userid).chatbox("option").messageSent(from.userid,from, msg);
            $("li[aria-controls='tabcb" + from.userid + "']").addClass("ui-state-highlight");
            //createNotification(from.userid);// tab scrolling notification for hidden tab
            var k = from.userid;
        }

        //send msg to self
        /*if (self == from.userid){
            $("#" + to.userid).chatbox("option").messageSent(to.userid,from, msg);
            var k = to.userid;
        }
        // to avoid error of undefined
        var k = to.userid;
        if (typeof(vApp.chat.vmstorage[k]) == 'undefined') {
            vApp.chat.vmstorage[k] = [];
        }
        console.log('vmstograge key = ' + k);*/
        vApp.chat.vmstorage[k].push({ userid:from.userid,name:from.name , msg: msg, time: time });
    }
}


// diplay user status(offlin/online)
function statusUpdate(from,msg,prop){
    if($("#" + from.userid).length){
      $("#" + from.userid).chatbox("option").messageSent(from.userid,from, msg);
      $("#ta" + from.userid).prop("disabled",prop);
    }
}

function common_chatbox_update(from,msg){
    if($("div#chat_room").length){
        $("#chat_room").chatroom("option").messageSent(from, msg);
    }
}

function newStatus(e){
    $.each(e.message, function(k, u) {
        if(e.newuser != null && u.userid == e.newuser){
            statusUpdate(u,'Online', false);
            common_chatbox_update(u, 'Online');
        }
    });
}

/*
    Create tabs
*/
function createTab(id,name){
    var myTabs = $('#tabs').tabs();
    var ind = $("div#tabs ul li").length;

    tabId = 'tabcb' + id;
    addTab(myTabs, tabId, ind, name);
}

function addTab(tabs,id,tabCounter,tabTitle) {
    //var tabTitle = $( "#tab_title" ),
    var tabContent = $( "#tab_content" ),
    tabTemplate = "<li id = '" + id + "' class = 'ui-state-default ui-corner-bottom ui-tabs-active ui-state-active' aria-controls = '" + id + "'><a href = '#{href}' class = 'ui-tabs-anchor'>#{label}</a> <a href = '#' role = 'button'class = 'ui-corner-all ui-chatbox-icon'><span class = 'ui-icon ui-icon-close'>close</span></a></li>";

    var label = tabTitle || "Tab " + tabCounter,
    id = id,
    li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
    tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";

    tabs.find( ".ui-tabs-nav" ).append( li );
    //tabs.tabs( "refresh" );
}

function browserSupportsLocalStorage()  {
    return ('localStorage' in window) && (window['localStorage'] != null);
}

/*
 preserve public chat on page refersh
*/
function displaycomChatHistory(){
    //common room chat data populated on referesh
    
    //if msglength == 1 and  sessionStorage.getItem('chatroom_status') == 'hidden'
    if(sessionStorage.length > 1 || (sessionStorage.length == 1 && sessionStorage.getItem('chatroom_status') == null) ){
        
            var d = document.createElement('div');
            d.id = 'chat_room';
            document.body.appendChild(d);
            var data = JSON.parse(sessionStorage.getItem('chatroom'));
            $.each(data, function(id, msgobj) {
                if(id < 1){
                    vApp.chat.chatroombox = $("#chat_room").chatroom({id:"chat_room",
                                                user : msgobj,
                                                title : "Common chat",
                                                messageSent : function(user, msg) {
                                                    $("#chat_room").chatroom("option", "boxManager").addMsg(user.name,msg);
                                                }});
                }
                $("#chat_room").chatroom("option").messageSent(msgobj, msgobj.msg);
            });
        
    }
    
    if(sessionStorage.getItem('chatroom_status') == 'hidden'){
        $("#chatrm" ).hide(); //hide box on page refresh
    }
}

/*
 preserve private chat on page refersh
*/
function displayPvtChatHistory(){
    
    //Private chat data populated on page referesh
    if (localStorage.getItem(wbUser.sid) != null){
        var data = JSON.parse(localStorage.getItem(wbUser.sid));
        $.each(data, function(id, msgarr) {
//            counter++;
//            idList.push(id);
              vApp.chat.counter++;
              vApp.chat.idList.push(id);

            $.each(msgarr, function(i, msgobj) {
                if(i < 1){
                    chatboxManager.addBox(id,
                                  {dest:"dest" + vApp.chat.counter, // not used in demo
                                   title:"box" + vApp.chat.counter,
                                   first_name:msgobj.name
                                  });

                    chatboxManager.init({
                        messageSent : function(id,user,msg){
                            $("#" + id).chatbox("option", "boxManager").addMsg(user.name, msg);
                        }
                    });
                }else{
                    $("#" + id).chatbox("option").messageSent(id, msgobj, msgobj.msg);
                }
            });
            if(localStorage.getItem(id) == 'hidden'){
                $("#cb" + id).hide(); //hide box on page refersh
                $("#tabcb" + id).removeClass('ui-state-active'); //make tab disable on page refersh
            }
        });
    }
}


/*
    Dialog box to display error messages
*/
function display_error(msg){
    $( "<div id = 'dialog' title = 'VmChat Error:'></div>" ).prependTo( "#stickybar" );
    $("#dialog").html(msg);
    $('#dialog').dialog();
}


function clearAllChatBox(){
    $(".ui-icon-closethick").trigger("click");
    //$("#chatrm .ui-icon-minusthick").trigger("click");
    //  alert("suman bogati chat lib.js");
}