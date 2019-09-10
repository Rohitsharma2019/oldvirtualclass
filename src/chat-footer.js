// widget for footer bar


(function ($) {
  $.widget('ui.footerbar', {
    options: {
      id: null, // id for the DOM element
      offset: 0, // relative to right edge of the browser window
      width: '100%', // width of the chatbox
      barscroll: ($(window).width() - 430),
      supportId: '7',
      boxClosed(id) {
      }, // called when the close icon is clicked
    },
    init(elem) {
      this.elem = elem;
    },
    widget() {
      return this.uiFooterbar;
    },

    _create() {
      const self = this;
      const { options } = self;
      const { offset } = options;
      const title = options.title || 'No Title';
      const control = roles.hasAdmin();
      const template = virtualclass.getTemplate('stickycont', 'chat');
      $('#stickycontainer').append(template({ control }));
      const chatroom_bt2 = document.getElementById('chatroom_bt2');
      const user_list = document.getElementById('user_list');
      const setting = document.querySelector('#appSettingCtrl');
      const settingD = document.querySelector('#virtualclassCont.congrea #appSettingDetail');
      const chat = document.querySelector('#virtualclassCont.congrea #rightSubContainer');


      $('#chatroom_bt2 .inner_bt').click(() => {
        if(virtualclass.gObj.hideRightbar == "true" || virtualclass.gObj.hideRightbar == true) {
          virtualclass.vutil.switchRightbar();
          virtualclass.gObj.hideRightbar = false;
        }
        const vmchat_room_bt = document.querySelector('#rightSubContainer .vmchat_room_bt');
        chatroom_bt2.classList.add('active');
        user_list.classList.remove('active');

        // $('#chatroom_bt2').addClass('active');
        // $('#user_list').removeClass('active');

        // var setting = document.querySelector("#appSettingCtrl");
        // var settingD = document.querySelector("#virtualclassCont.congrea #appSettingDetail");
        // var chat = document.querySelector("#virtualclassCont.congrea #chatWidget");
        if (setting.classList.contains('settingActive')) {
          setting.classList.remove('settingActive');
          setting.classList.add('chatActive');
        }
        chat.classList.remove('deactive');
        if (!chat.classList.contains('active')) {
          chat.classList.add('active');
        }
        settingD.classList.remove('active');
        if (!settingD.classList.contains('deactive')) {
          settingD.classList.add('deactive');
        }
        $('#chatroom_bt2').removeClass('ui-state-highlight');
        virtualclass.chat.chatWindow = 'common';
        if ($('ul#chat_room').length == 0) {
          const d = document.createElement('ul');
          d.id = 'chat_room';
          document.body.appendChild(d);

          virtualclass.chat.chatroombox = $('#chat_room').chatroom({
            id: 'chat_room',
            user: { name: 'test' },
            title: lang.chatroom_header,
            // offset: '20px',
            messageSent(user, msg) {
              const userid = user.userid || virtualclass.gObj.uid;
              $('#chat_room').chatroom('option', 'boxManager').addMsg(user.name, msg, userid);
            },
          });

          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'chatEnable')) {
            if (!virtualclass.gObj.chatEnable) {
              const chatCont = document.getElementById('chatrm');
              if (chatCont != null) {
                virtualclass.user.control.makeElemDisable(chatCont);
              }
            }
          }
          // TODO this need to be enable
          // document.querySelector('#chatwidget .vmchat_room_bt').dataSet.dataTitle = virtualclass.lang.getString('commonChat');
        }

        const chatbox = document.getElementById('ta_chrm2');
        if (chatbox) {
          chatbox.style.display = 'block';
        }

        const memlist = document.getElementById('memlist');
        if (memlist) {
          memlist.classList.remove('enable');
          if (!memlist.classList.contains('disable')) {
            memlist.classList.add('disable');
          }
        }


        const searchbox = document.getElementById('congreaUserSearch');
        if (searchbox) {
          searchbox.style.display = 'none';
        }

        const chatroom = document.getElementById('chatrm');
        if (chatroom) {
          if (!chatroom.classList.contains('enable')) {
            chatroom.classList.add('enable');
          }
          chatroom.classList.remove('disable');
        }
      });

      $('#user_list').click(function () {
        // $('#chatroom_bt2').removeClass('active');
        chatroom_bt2.classList.remove('active');
        // $('#congreaSupport').removeClass('active');
        // $('#user_list').addClass('active');
        user_list.classList.add('active');
        const setting = document.getElementById('appSettingCtrl');
        const chat = document.getElementById('rightSubContainer');
        const settingD = document.getElementById('appSettingDetail');
        if (setting.classList.contains('settingActive')) {
          setting.classList.remove('settingActive');
          setting.classList.add('chatActive');
        }

        chat.classList.remove('deactive');
        if (!chat.classList.contains('active')) {
          chat.classList.add('active');
        }

        settingD.classList.remove('active');
        if (!settingD.classList.contains('deactive')) {
          settingD.classList.add('deactive');
        }

        virtualclass.chat.chatWindow = 'private';
        this.classList.add('active');
        const chatroom = document.getElementById('chatrm');
        if (chatroom) {
          chatroom.classList.remove('enable');
          if (!chatroom.classList.contains('disable')) {
            chatroom.classList.add('disable');
          }
        }


        const chatbox = document.getElementById('ta_chrm2');
        if (chatbox) {
          chatbox.style.display = 'none';
        }

        const searchbox = document.getElementById('congreaUserSearch');
        if (searchbox) {
          searchbox.style.display = 'block';
        }

        const memlist = document.getElementById('memlist');
        if (memlist) {
          memlist.classList.remove('disable');
          if (!memlist.classList.contains('enable')) {
            memlist.classList.add('enable');
          }
        }
      }),

      $('#congreaUserSearch').keyup(function () {
        const text = this.value;
        searchUser(text);
      });
      // todo to change this code later
      function searchUser() {
        const arr = [];
        virtualclass.connectedUsers.forEach((item) => {
          if (item.userid != virtualclass.gObj.uid) {
            const obj = {
              id: item.userid,
              name: item.name.toLowerCase(),
            };

            arr.push(obj);
          }
        });

        const text = document.getElementById('congreaUserSearch').value;
        _searchUser(arr, text.toLowerCase());
      }

      function _searchUser(arr, search) {
        arr.forEach((obj, index) => {
          const userElem = chatContainerEvent.elementFromShadowDom(`ml${obj.id}`, null, true);
          if (obj.name.indexOf(search) != -1) {
            userElem.style.display = 'block';
            // $('#ml' + obj['id']).show();
          } else {
            // $('#ml' + obj['id']).hide();
            userElem.style.display = 'none';
          }
        });
      }

      self._setWidth(self.options.width);
      self.init(self);
    },
    destroy() {
      this.element.remove();
      // if using jQuery UI 1.9.x
      this._destroy();
    },
    // to ask
    _setWidth(width) {
      //  this.uiFooterbar.width(width + "px");
    },

  });
}(jQuery));

(function ($) {
  $.fn.clickToggle = function (func1, func2) {
    const funcs = [func1, func2];
    this.data('toggleclicked', 0);
    this.click(function () {
      const data = $(this).data();
      const tc = data.toggleclicked;
      $.proxy(funcs[tc], this)();
      data.toggleclicked = (tc + 1) % 2;
    });
    return this;
  };
}(jQuery));
