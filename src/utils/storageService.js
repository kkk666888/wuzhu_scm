/*
    封装localStorage,sessionStorage,cookies
*/
const storageService = {
    errorMessage: '本地储存写入错误，若为safari浏览器请关闭隐身模式浏览(无痕浏览)。',
    local: {
        baseKey: 'app_local',
        getKey(key) {
            return this.baseKey + '_' + key;
        },
        set(key, value) {
            try {
                window.localStorage.setItem(this.getKey(key), value);
            }
            catch (e) {
                alert(myStorage.errorMessage);
            }
        },
        setObj(key, value) {
            try {
                var json = JSON.stringify(value);
                window.localStorage.setItem(this.getKey(key), json);
            }
            catch (e) {
                alert(myStorage.errorMessage);
            }
        },
        get(key) {
            return window.localStorage.getItem(this.getKey(key));
        },
        getObj(key) {
            var json = window.localStorage.getItem(this.getKey(key));
            return JSON.parse(json);
        },
        remove(key) {
            window.localStorage.removeItem(this.getKey(key));
        },
        removeAll() {
            window.localStorage.clear();
        }
    },
    session: {
        baseKey: 'app_session',
        getKey(key) {
            return this.baseKey + '_' + key;
        },
        set(key, value) {
            try {
                window.sessionStorage.setItem(this.getKey(key), value);
            }
            catch (e) {
                alert(myStorage.errorMessage);
            }
        },
        setObj(key, value) {
            try {
                var json = JSON.stringify(value);
                window.sessionStorage.setItem(this.getKey(key), json);
            }
            catch (e) {
                alert(myStorage.errorMessage);
            }
        },
        get(key) {
            return window.sessionStorage.getItem(this.getKey(key));
        },
        getObj(key) {
            var json = window.sessionStorage.getItem(this.getKey(key));
            return JSON.parse(json);
        },
        remove(key) {
            window.sessionStorage.removeItem(this.getKey(key));
        },
        removeAll() {
            window.sessionStorage.clear();
        }
    },
    cookie: {
        set(key, value, expires, domain, path, secure) {
            var _value = encodeURIComponent(key) + '=' + encodeURIComponent(value);
            if (expires) {
                _value += ';expires = ' + expires;
            }

            if (path) {
                _value += ';path=' + path;
            }

            if (domain) {
                _value += ';domain=' + domain;
            }

            if (secure) {
                _value += ';secure';
            }

            document.cookie = _value;
        },
        get(key) {
            if(document.cookie.length==0){
                return '';
            }

            var cookieName = encodeURIComponent(key) + "=",
                cookieStart = document.cookie.indexOf(cookieName),
                cookieValue = "";
            if (cookieStart > -1) {
                var cookieEnd = document.cookie.indexOf(";", cookieStart);
                if (cookieEnd == -1) {
                    cookieEnd = document.cookie.length;
                }
                cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
            }
            return cookieValue;
        },
        remove(key, domain, path, secure) {
            this.set(key, "", Date(0), domain, path, secure);
        }
    }
}
export default storageService;

