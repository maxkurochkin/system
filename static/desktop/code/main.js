var system = null;

window.onload = function() {
    var container = document.getElementById('body');
    system = SystemClass(container);
    system.createShortcut(
        'manager/',
        'File System',
        'images/folder.png'
    );
    system.createShortcut(
        'console/',
        'Console',
        'images/console.png'
    );
};
