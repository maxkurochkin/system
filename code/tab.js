var TabClass = function(id) {
    var privateObject = {
        id: id,
        container: null,
        title: null,
        close: null
    };

    var object = {
        setActive: function(state) {
            if (state) { privateObject.container.setAttribute('class', 'tab active'); }
            else { privateObject.container.setAttribute('class', 'tab'); }
        },
        remove: function() {
            privateObject.container.parentNode.removeChild(privateObject.container);
        }
    };

    privateObject.container = document.createElement('div');
    privateObject.container.setAttribute('class', 'tab');
    system.tabsContainer.appendChild(privateObject.container);

    privateObject.title = document.createElement('div');
    privateObject.title.setAttribute('class', 'tab-title');
    privateObject.title.innerText = '#' + privateObject.id;
    privateObject.container.appendChild(privateObject.title);

    privateObject.close = document.createElement('div');
    privateObject.close.setAttribute('class', 'tab-close');
    privateObject.close.innerText = 'X';
    privateObject.container.appendChild(privateObject.close);

    privateObject.title.addEventListener('click', function(event) {
        system.sendWindowToFront(privateObject.id);
    });

    privateObject.close.addEventListener('click', function(event) {
        system.closeWindow(privateObject.id);
    });

    return object;
};
