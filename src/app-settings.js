(function (window, document) {
  /**
   * This is the main object which has properties and methods
   * Through this properties and methods all the front stuff is happening
   * eg:- creating, storing and replaying the objects
   */

  const appSetting = function (config) {
    return {
      init() {
        const toggle = document.querySelector('#virtualclassCont.congrea #appSettingCtrl');
        const chat = document.querySelector('#virtualclassCont.congrea #rightSubContainer');
        const setting = document.querySelector('#virtualclassCont.congrea #appSettingDetail');

        const privateChatTab = document.querySelector('#virtualclassCont.congrea .vmchat_bar_button');
        const commonChatTab = document.querySelector('#virtualclassCont.congrea .vmchat_room_bt');

        if (toggle) {
          toggle.addEventListener('click', () => {
            if(virtualclass.gObj.hideRightbar == "true" || virtualclass.gObj.hideRightbar == true) {
              virtualclass.vutil.switchRightbar();
              virtualclass.gObj.hideRightbar = false;
            }
            if (toggle.classList.contains('chatActive')) {
              toggle.classList.remove('chatActive');
              toggle.classList.add('settingActive');
              chat.classList.remove('active');
              chat.classList.add('deactive');
              setting.classList.add('active');
              setting.classList.remove('deactive');
              if (privateChatTab.classList.contains('active')) {
                privateChatTab.classList.remove('active');
              }
              if (commonChatTab.classList.contains('active')) {
                commonChatTab.classList.remove('active');
              }
            } else {
              toggle.classList.add('chatActive');
              toggle.classList.remove('settingActive');
              chat.classList.remove('deactive');
              chat.classList.add('active');
              setting.classList.remove('active');
              setting.classList.add('deactive');

              const memberList = document.querySelector('.congrea #memlist.enable');
              if (memberList) {
                privateChatTab.classList.add('active');
              }
              const commonChat = document.querySelector('.congrea #chatrm.enable');
              if (commonChat) {
                commonChatTab.classList.add('active');
              }
            }
          });
        }
      },
    };
  };
  window.appSetting = appSetting();
}(window, document));
