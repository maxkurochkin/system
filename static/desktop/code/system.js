var SystemClass = function(container) {
    var privateObject = {
        windows: [],
        shortcuts: [],
        getNewWindowId: function() {
            var newWindowId = 0;
            while (true) {
                var isWindowIdUsed = false;
                for (var index = 0; index < privateObject.windows.length; index++) {
                    if (privateObject.windows[index].getId() == newWindowId) {
                        isWindowIdUsed = true;
                        break;
                    }
                }
                if (!isWindowIdUsed) { return newWindowId; }
                newWindowId++;
            }
        },
        getWindowIndexById: function(windowId) {
            for (var index = 0; index < privateObject.windows.length; index++) {
                if (privateObject.windows[index].getId() == windowId) { return index; }
            }
            return null;
        },
        resetMouseActions: function() {
            object.mouse.currentWindowId = null;
            object.mouse.isWindowMoveAction = false;
            object.mouse.isWindowResizeAction = false;
        },
        resetWindowListStates: function() {
            var maxLayerWindowId = 0;
            var maxLayer = 0;
            for (var index = 0; index < privateObject.windows.length; index++) {
                var windowLayer = privateObject.windows[index].getLayer();
                if (windowLayer > maxLayer) { 
                    maxLayerWindowId = privateObject.windows[index].getId();
                    maxLayer = windowLayer;
                }
            }
            for (var index = 0; index < privateObject.windows.length; index++) {
                if (privateObject.windows[index].getId() == maxLayerWindowId) { 
                    privateObject.windows[index].setShield(false); 
                    privateObject.windows[index].setActive(true);
                }
                else { 
                    privateObject.windows[index].setShield(true);
                    privateObject.windows[index].setActive(false);
                }
            }
        }
    };

    var object = {
        windowsContainer: container,
        shortcutsContainer: null,
        tabsContainer: null,
        exitButton: null,
        mouse: {
            startPosition: { x: 0, y: 0 },
            currentWindowId: null,
            isWindowMoveAction: false,
            isWindowResizeAction: false
        },
        createShortcut: function(url, name, image) {
            var newShortcut = ShortcutClass(url, name, image);
            privateObject.shortcuts.push(newShortcut);
        },
        createWindow: function(url) {
            if (privateObject.windows.length < settings.MAX_WINDOW_COUNT) {
                var newWindow = WindowClass(privateObject.getNewWindowId(), url);
                privateObject.windows.push(newWindow);
                object.sendWindowToFront(newWindow.getId());
            }
        },
        closeWindow: function(windowId) {
            var windowIndex = privateObject.getWindowIndexById(windowId);
            if (windowIndex !== null) {
                privateObject.windows[windowIndex].remove();
                privateObject.windows.splice(windowIndex, 1);
                privateObject.resetWindowListStates();
                privateObject.resetMouseActions();
            }
        },
        sendWindowToFront: function(windowId) {
            var windowIndex = privateObject.getWindowIndexById(windowId);
            if (windowIndex === null) { return null; }
            var changedWindowIndexList = [];
            for (var step = 0; step < privateObject.windows.length; step++) {
                var minWindowLayer = null;
                var minWindowLayerIndex = null;
                for (var index = 0; index < privateObject.windows.length; index++) {
                    if ((index != windowIndex)
                    && (changedWindowIndexList.indexOf(index) == -1)) {
                        var layer = privateObject.windows[index].getLayer();
                        if ((minWindowLayer === null)
                        || (layer < minWindowLayer)) {
                            minWindowLayer = layer;
                            minWindowLayerIndex = index;
                        }
                    }
                }
                if (minWindowLayerIndex !== null) {
                    var layer = changedWindowIndexList.length + 1;
                    privateObject.windows[minWindowLayerIndex].setLayer(layer);
                    changedWindowIndexList.push(minWindowLayerIndex);
                }
            }
            var layer = changedWindowIndexList.length + 1;
            privateObject.windows[windowIndex].setLayer(layer);
            object.tabsContainer.style['z-index'] = layer + 1;
            privateObject.resetWindowListStates();
        }
    };

    object.shortcutsContainer = document.createElement('div');
    object.shortcutsContainer.setAttribute('id', 'shortcuts');
    object.windowsContainer.appendChild(object.shortcutsContainer);

    object.tabsContainer = document.createElement('div');
    object.tabsContainer.setAttribute('id', 'tabs');
    object.windowsContainer.appendChild(object.tabsContainer);

    object.exitButton = document.createElement('div');
    object.exitButton.setAttribute('id', 'exit');
    object.exitButton.innerText = 'END';
    object.tabsContainer.appendChild(object.exitButton);

    object.windowsContainer.addEventListener('mousemove', function(event) {
        var windowId = object.mouse.currentWindowId;
        if (windowId === null) { return null; }
        var windowIndex = privateObject.getWindowIndexById(windowId);
        if (windowIndex === null) { return null; }
        var deltaX = event.pageX - object.mouse.startPosition.x;
        var deltaY = event.pageY - object.mouse.startPosition.y;
        if (object.mouse.isWindowMoveAction) {
            privateObject.windows[windowIndex].setPosition(
                privateObject.windows[windowIndex].preMovePosition.x + deltaX,
                privateObject.windows[windowIndex].preMovePosition.y + deltaY
            );
        }
        else if (object.mouse.isWindowResizeAction) {
            privateObject.windows[windowIndex].setSize(
                privateObject.windows[windowIndex].preResizeSize.x + deltaX,
                privateObject.windows[windowIndex].preResizeSize.y + deltaY
            );
        }
    });

    object.windowsContainer.addEventListener('mouseup', function(event) {
        privateObject.resetMouseActions();
        privateObject.resetWindowListStates();
    });

    return object;
};
