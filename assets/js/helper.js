
function emptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function setAttributes(element, attrs) {
    for (let key in attrs) {
        element.setAttribute(key, attrs[key])
    }
    return element
}

function createQueryString(params) {
    var temp = []
    for (let i in params) {
        temp.push([encodeURIComponent(i), encodeURIComponent(params[i])].join('='))    
    }
    return temp.join('&')
}

function sendHttpReq(uri, method, params, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.status, xhr.responseText)
        }
    };
    if (method == 'GET') {
        xhr.send(createQueryString(params))
    } else if (method == 'POST') {
        xhr.send(JSON.stringify(data));
    } else if (method == 'PUT') {
        xhr.send(JSON.stringify(data));
    } else if (method == 'DELETE') {
        xhr.send()
    }
}

function uuid4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}