!(function (t) {
  if (((window.syftc = t), window.syft)) return;
  (window.syft = []),
    ['identify', 'track', 'page'].forEach(function (t) {
      window.syft[t] = function () {
        var s = [].slice.call(arguments);
        s.unshift(t), window.syft.push(s);
      };
    });
  var s = document.createElement('script');
  (s.async = !0),
    s.setAttribute('src', 'https://cdn.syftdata.com/syftnext/syft.umd.js'),
    (document.body || document.head).appendChild(s);
})({sourceId: 'clrqv5nli0007jv09t58zir92'});
