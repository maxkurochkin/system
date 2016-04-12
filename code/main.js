var system = null;

window.onload = function() {
    var container = document.getElementById('body');
    system = SystemClass(container);
    system.createWindow('http://g2/');
    system.createWindow('http://g2/');
    system.createWindow('http://g2/');
};
