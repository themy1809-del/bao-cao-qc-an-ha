/* qc_khoa.js — CHỐT CHẶN ĐĂNG NHẬP (29/09/2026)
   Đặt NGAY SAU <script src="qcdata.js">.
   - qcdata.js CHƯA khoá (window.QCDATA có rows): KHÔNG làm gì — trang chạy y như cũ.
   - qcdata.js ĐÃ khoá (window.QCDATA_ENC, do khoa_qcdata.py tạo):
       · đã đăng nhập trong tab này (bản giải mã khớp phiên bản v) -> gán window.QCDATA, trang chạy bình thường
       · chưa -> chuyển sang dangnhap.html, dừng tải phần còn lại của trang.
   Giải mã nằm ở dangnhap.html (WebCrypto). File này chỉ đọc bản đã giải mã, chạy ĐỒNG BỘ
   để mọi script phía sau vẫn thấy window.QCDATA như trước. */
(function(){
  var E=window.QCDATA_ENC;
  window.QC_KHOA={bat:false,user:null};
  if(!E||(window.QCDATA&&window.QCDATA.rows))return;
  window.QC_KHOA.bat=true;
  var txt=null;
  try{
    var cv=sessionStorage.getItem('qcPlainV'), cts=+(sessionStorage.getItem('qcPlainTs')||0);
    /* cùng phiên bản, hoặc bản đã giải mã MỚI HƠN file trình duyệt đang giữ trong bộ đệm */
    if(cv===E.v||(cts&&E.ts&&cts>=+E.ts))txt=sessionStorage.getItem('qcPlain');
  }catch(e){}
  if(!txt){var P='QCPLAIN1|'+E.v+'|',n=String(window.name||'');if(n.indexOf(P)===0)txt=n.slice(P.length);}
  if(txt){
    try{
      var o=JSON.parse(txt);
      if(o&&o.rows&&o.rows.length){
        window.QCDATA=o;
        try{window.QC_KHOA.user=JSON.parse(sessionStorage.getItem('qcUser')||'null');}catch(e){}
        return;
      }
    }catch(e){}
  }
  var here=(location.pathname.split('/').pop()||'qc.html');
  location.replace('dangnhap.html?next='+encodeURIComponent(here+location.search+location.hash));
  /* Chặn phần còn lại của trang trong lúc chuyển: <plaintext> nuốt toàn bộ HTML phía sau thành chữ
     -> không script nào chạy tiếp. (KHÔNG dùng window.stop(): nó huỷ luôn lệnh chuyển trang.) */
  try{document.documentElement.style.visibility='hidden';}catch(e){}
  try{document.write('<plaintext style="display:none">');}catch(e){}
})();
/* Đăng xuất: xoá mọi thứ đã lưu trên máy (bản giải mã, khoá nhớ, người dùng) */
window.qcDangXuat=function(){
  try{['qcPlain','qcPlainV','qcPlainTs','qcUser','qcKek'].forEach(function(k){sessionStorage.removeItem(k);});}catch(e){}
  try{localStorage.removeItem('qcNho_v1');}catch(e){}
  try{if(String(window.name||'').indexOf('QCPLAIN1|')===0)window.name='';}catch(e){}
  location.replace('dangnhap.html?out=1&next='+encodeURIComponent((location.pathname.split('/').pop()||'qc.html')));
};
