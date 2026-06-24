/* ============================================================
   QR CODES
   ============================================================ */
function viewQr(){
  var cards = S.deviceRegistry.map(function(d){
    return '<div class="glass" style="border-radius:var(--radius-lg);box-shadow:var(--shadow-soft);padding:20px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center">'
      + qrBox(d.id)
      + '<div><div style="font-weight:var(--fw-bold);color:var(--accent-strong);font-size:.92rem">'+esc(d.id)+'</div><div style="font-size:.82rem;color:var(--text-muted);margin-top:2px;line-height:1.35">'+esc(d.name)+'</div></div>'
      + '<div style="display:flex;gap:8px;width:100%">'
      +   '<button class="btn-ghost" style="flex:1;padding:9px 0;font-size:.82rem;color:var(--accent-strong)" onclick="openEditDevice(\''+esc(d.id)+'\')">แก้ไข</button>'
      +   '<button style="flex:1;border:1px solid rgba(176,93,70,0.30);background:var(--danger-soft);border-radius:999px;padding:9px 0;font-size:.82rem;font-weight:var(--fw-semibold);cursor:pointer;color:var(--danger);transition:var(--transition-base)" onclick="deleteDevice(\''+esc(d.id)+'\')">ลบ</button>'
      + '</div>'
      + '<button style="border:0;background:var(--grad-tint-pine);border-radius:999px;padding:9px 18px;font-size:.84rem;font-weight:var(--fw-semibold);cursor:pointer;color:var(--accent-strong);width:100%;transition:var(--transition-base)" onclick="printQr(\''+esc(d.id)+'\')">พิมพ์ PDF</button>'
      + '</div>';
  }).join('');

  var modal = '';
  if (S.devForm.open){
    var f = S.devForm;
    modal = '<div onclick="if(event.target===this)closeDevForm()" style="position:fixed;inset:0;z-index:60;background:rgba(30,43,40,0.34);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:24px;animation:riseIn .24s var(--ease) both">'
      + '<div class="glass" style="width:100%;max-width:440px;padding:28px 30px;display:flex;flex-direction:column;gap:20px">'
      + '<div><div class="eyebrow">'+(f.mode==='edit'?'EDIT DEVICE':'NEW DEVICE')+'</div><h2 style="margin:4px 0 0;font-size:var(--text-h3);font-weight:var(--fw-black);letter-spacing:var(--tracking-tight)">'+(f.mode==='edit'?'แก้ไขข้อมูลอุปกรณ์':'เพิ่มอุปกรณ์ใหม่')+'</h2></div>'
      + '<div style="display:grid;gap:8px"><label class="label">รหัสอุปกรณ์</label><input class="field" style="padding:14px 16px" value="'+esc(f.id)+'" oninput="onDevFormField(\'id\',this.value)" placeholder="เช่น NB-00999"></div>'
      + '<div style="display:grid;gap:8px"><label class="label">ชื่ออุปกรณ์</label><input class="field" style="padding:14px 16px" value="'+esc(f.name)+'" oninput="onDevFormField(\'name\',this.value)" placeholder="เช่น Notebook Dell Latitude 5440"></div>'
      + (f.error ? '<div style="display:flex;align-items:center;gap:9px;padding:11px 14px;border-radius:var(--radius-md);background:var(--danger-soft);border:1px solid rgba(176,93,70,0.26);color:var(--danger);font-size:.86rem;font-weight:var(--fw-semibold)"><span style="width:8px;height:8px;border-radius:999px;background:var(--danger);flex:0 0 auto"></span>'+esc(f.error)+'</div>' : '')
      + '<div style="display:flex;gap:10px;justify-content:flex-end;border-top:1px solid var(--line);padding-top:18px">'
      +   '<button class="btn-ghost" style="padding:13px 24px;font-size:.94rem" onclick="closeDevForm()">ยกเลิก</button>'
      +   '<button class="btn-primary" style="padding:13px 28px;font-size:.94rem" onclick="saveDevice()">'+(f.mode==='edit'?'บันทึกการแก้ไข':'เพิ่มอุปกรณ์')+'</button>'
      + '</div></div></div>';
  }

  return '<section style="animation:riseIn .6s var(--ease) both">'
  + '<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px">'
  +   '<span style="color:var(--text-muted);font-size:.94rem">อุปกรณ์ที่ลงทะเบียน '+S.deviceRegistry.length+' ชิ้น · สแกนเพื่อแจ้งซ่อมหน้างานได้ทันที</span>'
  +   '<div style="display:flex;gap:8px">'
  +     '<button class="btn-primary" style="padding:12px 22px;font-size:.92rem;display:inline-flex;align-items:center;gap:8px" onclick="openAddDevice()"><span style="font-size:1.1rem;line-height:1;font-weight:var(--fw-light)">+</span>เพิ่มอุปกรณ์</button>'
  +     '<button class="btn-ghost" style="padding:12px 22px;font-size:.92rem" onclick="printAll()">พิมพ์ทั้งหมด (PDF)</button>'
  +   '</div></div>'
  + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px">'+cards+'</div>'
  + modal + '</section>';
}

function openAddDevice(){ setState({ devForm:{ open:true, mode:'add', editId:null, id:'', name:'', error:'' } }); }
function openEditDevice(id){
  var d = S.deviceRegistry.filter(function(x){ return x.id === id; })[0];
  if (!d) return;
  setState({ devForm:{ open:true, mode:'edit', editId:id, id:d.id, name:d.name, error:'' } });
}
function closeDevForm(){ setState(function(s){ var f = s.devForm; f.open = false; return { devForm:f }; }); }
function onDevFormField(key, val){ S.devForm[key] = val; S.devForm.error = ''; }
function saveDevice(){
  var f = S.devForm, id = f.id.trim(), name = f.name.trim();
  if (!id || !name){ setState(function(s){ s.devForm.error = 'กรุณากรอกรหัสและชื่ออุปกรณ์ให้ครบ'; return { devForm:s.devForm }; }); return; }
  var dup = S.deviceRegistry.some(function(d){ return d.id === id && d.id !== f.editId; });
  if (dup){ setState(function(s){ s.devForm.error = 'รหัสอุปกรณ์นี้มีอยู่แล้ว'; return { devForm:s.devForm }; }); return; }
  var reg;
  if (f.mode === 'edit') reg = S.deviceRegistry.map(function(d){ return d.id === f.editId ? { id:id, name:name } : d; });
  else reg = S.deviceRegistry.concat([{ id:id, name:name }]);
  var editId = f.editId, mode = f.mode;
  S.devForm.open = false;
  setState({ deviceRegistry:reg, devForm:S.devForm });
  toastMsg(mode === 'edit' ? ('แก้ไขข้อมูลอุปกรณ์ '+id+' แล้ว') : ('เพิ่มอุปกรณ์ '+id+' เรียบร้อยแล้ว'));
  if (hasBackend())
    google.script.run.withFailureHandler(function(){ toastMsg('บันทึกอุปกรณ์ลง Google Sheet ไม่สำเร็จ'); })
      .saveDevice({ id:id, name:name, editId:(mode === 'edit' ? editId : null) });
}
function deleteDevice(id){
  setState({ deviceRegistry: S.deviceRegistry.filter(function(d){ return d.id !== id; }) });
  toastMsg('ลบอุปกรณ์ '+id+' ออกจากระบบแล้ว');
  if (hasBackend())
    google.script.run.withFailureHandler(function(){ toastMsg('ลบอุปกรณ์จาก Google Sheet ไม่สำเร็จ'); }).deleteDevice(id);
}
function openQrPrint(list){
  if (!list.length){ toastMsg('ไม่มีอุปกรณ์ให้พิมพ์'); return; }
  var ep = function(v){ return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  var cards = list.map(function(d){
    var src = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=0&data=' + encodeURIComponent(scanUrlFor(d.id));
    return '<div class="qrc"><img src="'+src+'" alt="QR '+ep(d.id)+'"><div class="qid">'+ep(d.id)+'</div><div class="qnm">'+ep(d.name)+'</div><div class="qhint">สแกนเพื่อแจ้งซ่อม</div></div>';
  }).join('');
  var html = '<!doctype html><html lang="th"><head><meta charset="utf-8"><title>QR อุปกรณ์</title>'
    + '<style>@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700;800&display=swap");'
    + '*{font-family:\'Sarabun\',sans-serif;box-sizing:border-box;margin:0}body{padding:14mm;color:#1e2b28}'
    + '.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10mm}'
    + '.qrc{border:1.5px dashed #b8c2bf;border-radius:10px;padding:8mm 4mm;text-align:center;page-break-inside:avoid;display:flex;flex-direction:column;align-items:center;gap:3mm}'
    + '.qrc img{width:46mm;height:46mm}'
    + '.qid{font-weight:800;color:#194940;font-size:15px}.qnm{font-size:12px;color:#444;line-height:1.3}.qhint{font-size:11px;color:#888;margin-top:2mm}'
    + '@media print{body{padding:8mm}}</style></head>'
    + '<body onload="setTimeout(function(){window.print()},600)"><div class="grid">'+cards+'</div></body></html>';
  var w = window.open('', '_blank');
  if (!w){ toastMsg('กรุณาอนุญาต pop-up เพื่อพิมพ์ PDF'); return; }
  w.document.open(); w.document.write(html); w.document.close();
}
function printQr(id){ var d = S.deviceRegistry.filter(function(x){ return x.id === id; })[0]; if (d) openQrPrint([d]); }
function printAll(){ openQrPrint(S.deviceRegistry); }

