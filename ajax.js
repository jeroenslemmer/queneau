function ajax(e,t,i){i=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),i.onreadystatechange=function(){4==i.readyState&&(/^2/.test(i.status)&&t.success?t.success(i):/^5/.test(i.status)&&t.fail?t.fail(i):t.other&&t.other(i))},i.open(t.method||"POST",e,!0),i.send(t.data)}