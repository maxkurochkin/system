var ShortcutClass = function(url, name, image) {
    var privateObject = {
        url: url, 
        name: name, 
        image: image,
        elements: {
            container: null,
            image: null,
            title: null
        }
    };

    var object = {
        remove: function() {
            privateObject.elements.container.parentNode.removeChild(
                privateObject.elements.container
            );
        }
    };

    privateObject.elements.container = document.createElement('div');
    privateObject.elements.container.setAttribute('class', 'shortcut');
    system.shortcutsContainer.appendChild(privateObject.elements.container);

    privateObject.elements.image = document.createElement('img');
    privateObject.elements.image.setAttribute('src', privateObject.image);
    privateObject.elements.container.appendChild(privateObject.elements.image);

    privateObject.elements.title = document.createElement('span');
    privateObject.elements.title.innerText = privateObject.name;
    privateObject.elements.container.appendChild(privateObject.elements.title);

    privateObject.elements.container.addEventListener('click', function(event) {
        system.createWindow(privateObject.url);
    });

    return object;
};
