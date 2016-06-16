var WindowClass = function(id, url) {
    var startOffsetX = Math.random() * settings.START_WINDOW_OFFSET * 2;
    var startOffsetY = Math.random() * settings.START_WINDOW_OFFSET * 2;
    startOffsetX = Math.round(startOffsetX - settings.START_WINDOW_OFFSET);
    startOffsetY = Math.round(startOffsetY - settings.START_WINDOW_OFFSET);

    var privateObject = {
        id: id,
        url: url,
        layer: 0,
        tab: TabClass(id),
        container: null,
        position: { 
            x: settings.START_WINDOW_X + startOffsetX,
            y: settings.START_WINDOW_Y + startOffsetY
        },
        size: { 
            x: settings.START_WINDOW_WIDTH,
            y: settings.START_WINDOW_HEIGHT 
        },
        top: { container: null, title: null, close: null },
        main: { container: null, iframe: null, shield: null },
        bottom: { container: null, refresh: null, resize: null }
    };

    var object = {
        preMovePosition: {
            x: privateObject.position.x,
            y: privateObject.position.y
        },
        preResizeSize: {
            x: privateObject.size.x,
            y: privateObject.size.y
        },
        getId: function() {
            return privateObject.id;
        },
        getLayer: function() {
            return privateObject.layer;
        },
        setLayer: function(layer) {
            privateObject.layer = layer;
            privateObject.container.style['z-index'] = privateObject.layer;
        },
        setActive: function(state) {
            if (state) { privateObject.container.setAttribute('class', 'window active'); }
            else { privateObject.container.setAttribute('class', 'window'); }
            privateObject.tab.setActive(state);
        },
        setShield: function(state) {
            if (state) { privateObject.main.shield.style['display'] = 'block'; }
            else { privateObject.main.shield.style['display'] = 'none'; }
        },
        setPosition: function(x, y) {
            privateObject.position.x = Math.round(x);
            privateObject.position.y = Math.round(y);
            privateObject.container.style['left'] = privateObject.position.x + 'px';
            privateObject.container.style['top'] = privateObject.position.y + 'px';
        },
        setSize: function(x, y) {
            var newX = settings.MIN_WINDOW_WIDTH;
            var newY = settings.MIN_WINDOW_HEIGHT;
            if (x >= settings.MIN_WINDOW_WIDTH) { newX = Math.round(x); }
            if (y >= settings.MIN_WINDOW_HEIGHT) { newY = Math.round(y); }
            privateObject.size.x = newX;
            privateObject.size.y = newY;
            privateObject.main.container.style['width'] = newX + 'px';
            privateObject.main.container.style['height'] = newY + 'px';
        },
        remove: function() {
            privateObject.container.parentNode.removeChild(privateObject.container);
            privateObject.tab.remove();
        }
    };

    privateObject.container = document.createElement('div');
    privateObject.container.setAttribute('class', 'window');
    privateObject.container.style['left'] = privateObject.position.x + 'px';
    privateObject.container.style['top'] = privateObject.position.y + 'px';
    privateObject.container.style['z-index'] = privateObject.layer;
    system.windowsContainer.appendChild(privateObject.container);

    privateObject.top.container = document.createElement('div');
    privateObject.top.container.setAttribute('class', 'window-top');
    privateObject.container.appendChild(privateObject.top.container);

    privateObject.main.container = document.createElement('div');
    privateObject.main.container.setAttribute('class', 'window-main');
    privateObject.main.container.style['width'] = privateObject.size.x + 'px';
    privateObject.main.container.style['height'] = privateObject.size.y + 'px';
    privateObject.container.appendChild(privateObject.main.container);

    privateObject.bottom.container = document.createElement('div');
    privateObject.bottom.container.setAttribute('class', 'window-bottom');
    privateObject.container.appendChild(privateObject.bottom.container);

    privateObject.top.title = document.createElement('div');
    privateObject.top.title.setAttribute('class', 'window-title');
    privateObject.top.title.innerText = '#' + privateObject.id;
    privateObject.top.container.appendChild(privateObject.top.title);

    privateObject.top.close = document.createElement('div');
    privateObject.top.close.setAttribute('class', 'window-close');
    privateObject.top.close.innerText = 'X';
    privateObject.top.container.appendChild(privateObject.top.close);

    privateObject.main.iframe = document.createElement('iframe');
    privateObject.main.iframe.setAttribute('class', 'window-iframe');
    privateObject.main.iframe.setAttribute('src', privateObject.url);
    privateObject.main.container.appendChild(privateObject.main.iframe);

    privateObject.main.shield = document.createElement('div');
    privateObject.main.shield.setAttribute('class', 'window-shield');
    privateObject.main.shield.style['display'] = 'none';
    privateObject.main.container.appendChild(privateObject.main.shield);

    privateObject.bottom.refresh = document.createElement('div');
    privateObject.bottom.refresh.setAttribute('class', 'window-refresh');
    privateObject.bottom.refresh.innerText = 'R';
    privateObject.bottom.container.appendChild(privateObject.bottom.refresh);

    privateObject.bottom.resize = document.createElement('div');
    privateObject.bottom.resize.setAttribute('class', 'window-resize');
    privateObject.bottom.resize.innerText = 'S';
    privateObject.bottom.container.appendChild(privateObject.bottom.resize);

    privateObject.container.addEventListener('mousedown', function(event) {
        system.sendWindowToFront(privateObject.id);
        object.setShield(true);
    });

    privateObject.top.container.addEventListener('mousedown', function(event) {
        system.mouse.startPosition.x = event.pageX;
        system.mouse.startPosition.y = event.pageY;
        object.preMovePosition.x = privateObject.position.x;
        object.preMovePosition.y = privateObject.position.y;
        system.mouse.isWindowMoveAction = true;
        system.mouse.currentWindowId = privateObject.id;
    });

    privateObject.top.close.addEventListener('mousedown', function(event) {
        system.closeWindow(privateObject.id);
        event.stopPropagation();
    });

    privateObject.bottom.refresh.addEventListener('mouseup', function(event) {
        privateObject.main.iframe.setAttribute('src', privateObject.url);
    });

    privateObject.bottom.resize.addEventListener('mousedown', function(event) {
        system.mouse.startPosition.x = event.pageX;
        system.mouse.startPosition.y = event.pageY;
        object.preResizeSize.x = privateObject.size.x;
        object.preResizeSize.y = privateObject.size.y;
        system.mouse.isWindowResizeAction = true;
        system.mouse.currentWindowId = privateObject.id;
    });

    return object;
};
