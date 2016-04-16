var system = null;

window.onload = function() {
    var container = document.getElementById('body');
    system = SystemClass(container);
    system.createShortcut(
        'http://g2/',
        'File System',
        'images/folder.png'
    );
    system.createShortcut(
        'http://w3/wos/',
        'Console',
        'images/console.png'
    );
};
