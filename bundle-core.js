(function(root){
function calculate(bundle,variants,products,minMargin=0){
 const errors=[],notes=[],rows=[];let total=0,cost=0,capacity=Infinity;const seen=new Set();
 for(const item of bundle.items||[]){const v=variants.find(v=>v.id===item.variant_id),p=v&&products.find(p=>p.id===v.product_id);if(!v||!p){errors.push('أحد المنتجات غير موجود.');continue}if(seen.has(v.id)){errors.push('المنتج مكرر؛ عدّل كميته في سطر واحد.');continue}seen.add(v.id);const q=Number(item.quantity);if(!Number.isInteger(q)||q<1){errors.push('يجب أن تكون الكميات أعدادًا صحيحة موجبة.');continue}rows.push({v,p,q});total+=Math.round(v.price*100)*q;cost+=Math.round(v.cost_price*100)*q;capacity=Math.min(capacity,Math.floor(v.stock_quantity/q));if(v.stock_quantity<q||p.status!=='active')errors.push('المخزون غير كافٍ: '+p.name)}
 if(new Set(rows.map(r=>r.p.id)).size<2)errors.push('اختر منتجين مختلفين على الأقل.');
 const ids=rows.map(r=>r.p.id);const d01=ids.includes('prd_029'),d02=ids.some(id=>['prd_008','prd_009'].includes(id));const f01=ids.includes('prd_030'),f02=ids.some(id=>['prd_010','prd_028'].includes(id));if((d01&&f02)||(d02&&f01))errors.push('مقاس القطّارة والفلاتر غير متطابق (01 / 02).');
 if(ids.some(id=>/^prd_00[1-7]$/.test(id))&&!ids.some(id=>['prd_014','prd_015','prd_016'].includes(id)))notes.push('القهوة حبوب كاملة؛ تحتاج مطحنة غير مشمولة في الباقة.');
 if((d01||d02)&&!f01&&!f02)notes.push('الباقة لا تتضمن فلاتر للقطّارة.');
 if((d01||d02)&&!ids.includes('prd_013'))notes.push('الباقة لا تتضمن غلاية.');
 if(ids.includes('prd_018'))notes.push('إبريق الموكا غير متوافق مع موقد الحث.');
 const cents=Math.round(Number(bundle.price)*100),margin=cents>0?(cents-cost)/cents*100:0;
 if(!String(bundle.name||'').trim())errors.push('أدخل اسم الباقة.');if(!Number.isFinite(cents)||cents<=0)errors.push('أدخل سعرًا موجبًا صحيحًا.');else{if(cents>total)errors.push('سعر الباقة أعلى من مجموع أسعار المنتجات.');if(cents<cost)errors.push('سعر الباقة أقل من تكلفة المنتجات.');if(margin+1e-8<minMargin)errors.push('الهامش أقل من الحد المستهدف. عدّل السعر أو المحتويات.');}
 return {total:total/100,cost:cost/100,profit:(cents-cost)/100,margin,savings:(total-cents)/100,capacity:Number.isFinite(capacity)?capacity:0,errors:[...new Set(errors)],notes,rows};
}
root.BundleCore={calculate};if(typeof module!=='undefined')module.exports=root.BundleCore;
})(typeof window!=='undefined'?window:globalThis);
