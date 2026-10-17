import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbuVZaV7-EjvIfmr_cziq93r7MXPw-xEM",
  authDomain: "threadstock-cb7ee.firebaseapp.com",
  projectId: "threadstock-cb7ee",
  storageBucket: "threadstock-cb7ee.firebasestorage.app",
  messagingSenderId: "1028788600759",
  appId: "1:1028788600759:web:768e8ee6f28b5ada1a7232",
  measurementId: "G-PDV7234CK1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const authForm = document.getElementById("authForm");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const submitBtn = document.getElementById("submitBtn");
const confirmWrap = document.getElementById("confirmWrap");
const confirmPassword = document.getElementById("confirmPassword");
const forgotBtn = document.getElementById("forgotBtn");
const googleBtn = document.getElementById("googleBtn");
const switchPrompt = document.getElementById("switchPrompt");
const switchLink = document.getElementById("switchLink");
const notice = document.getElementById("notice");

let mode = "login";

function showNotice(message, type = "error") {
  notice.textContent = message;
  notice.className = `notice show ${type}`;
}

function clearNotice() {
  notice.textContent = "";
  notice.className = "notice";
}

function setMode(nextMode) {
  mode = nextMode;
  const signup = mode === "signup";

  loginTab.classList.toggle("active", !signup);
  signupTab.classList.toggle("active", signup);
  formTitle.textContent = signup ? "Create your account" : "Welcome back";
  formSubtitle.textContent = signup
    ? "Sign up to start managing your clothing store."
    : "Log in to manage your clothing store.";
  submitBtn.textContent = signup ? "Create account" : "Log in";
  confirmWrap.classList.toggle("hidden", !signup);
  confirmPassword.required = signup;
  forgotBtn.classList.toggle("hidden", signup);
  switchPrompt.textContent = signup
    ? "Already have an account?"
    : "New to ThreadStock?";
  switchLink.textContent = signup ? "Log in" : "Create an account";

  clearNotice();
}

loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));
switchLink.addEventListener("click", () =>
  setMode(mode === "login" ? "signup" : "login")
);

onAuthStateChanged(auth, user => {
  if (user) {
    showNotice(
      `Signed in as ${user.email || "Google user"}. Authentication is working.`,
      "success"
    );
  }
});

authForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearNotice();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    if (mode === "signup") {
      if (password !== confirmPassword.value) {
        showNotice("The passwords do not match.");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      showNotice("Account created successfully. You are now signed in.", "success");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      showNotice("Login successful.", "success");
    }
  } catch (error) {
    showNotice(friendlyError(error.code));
  }
});

googleBtn.addEventListener("click", async () => {
  clearNotice();

  try {
    await signInWithPopup(auth, googleProvider);
    showNotice("Google sign-in successful.", "success");
  } catch (error) {
    showNotice(friendlyError(error.code));
  }
});

forgotBtn.addEventListener("click", async () => {
  clearNotice();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    showNotice("Enter your email address first, then click Forgot password?");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showNotice("Password reset email sent. Check your inbox.", "success");
  } catch (error) {
    showNotice(friendlyError(error.code));
  }
});

function friendlyError(code) {
  const messages = {
    "auth/email-already-in-use": "An account with this email already exists. Please log in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Use a password with at least 6 characters.",
    "auth/user-not-found": "No account found. Please sign up first.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/unauthorized-domain": "Add your website domain under Firebase Authentication settings → Authorized domains.",
    "auth/operation-not-allowed": "Enable this sign-in method in Firebase Authentication settings."
  };

  return messages[code] ||
    `Authentication failed (${code || "unknown error"}). Please try again.`;
  (()=>{const $=id=>document.getElementById(id),money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(Number(n)||0),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),uid=()=>crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};let products=load('ts_products',[]),sales=load('ts_sales',[]),cart=[];const save=()=>{localStorage.setItem('ts_products',JSON.stringify(products));localStorage.setItem('ts_sales',JSON.stringify(sales))},toast=m=>{$('toast').textContent=m;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2500)};const pages=['dashboard','products','billing','sales'];function page(p){pages.forEach(x=>$(x).classList.toggle('active',x===p));document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.page===p));$('page-title').textContent=({dashboard:'Dashboard',products:'Products & Stock',billing:'Create Bill',sales:'Sales History'})[p];if(p==='billing')options();window.scrollTo(0,0)}document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>page(b.dataset.page));$('today')?.remove();function status(n){return n===0?['Out of stock','out']:n<=5?['Low stock','low']:['In stock','good']}function dashboard(){$('stat-products').textContent=products.length;$('stat-units').textContent=products.reduce((s,p)=>s+p.stock,0);$('stat-low').textContent=products.filter(p=>p.stock<=5).length;$('stat-sales').textContent=money(sales.reduce((s,b)=>s+b.total,0));const low=products.filter(p=>p.stock<=5);$('low-list').innerHTML=low.length?low.map(p=>`<div class="line"><strong>${esc(p.name)} <small>${esc(p.size)} · ${esc(p.category)}</small></strong><span class="pill ${status(p.stock)[1]}">${p.stock} left</span></div>`).join(''):'<div class="empty">No low-stock products. Nice work!</div>';$('recent-list').innerHTML=sales.length?[...sales].slice(-4).reverse().map(b=>`<div class="line"><strong>${esc(b.id)}<small>${esc(b.customer)}</small></strong><b>${money(b.total)}</b></div>`).join(''):'<div class="empty">No sales recorded yet.</div>'}function renderProducts(){const q=$('search').value.toLowerCase(),cat=$('filter').value,arr=products.filter(p=>(!q||[p.name,p.category,p.size].some(v=>v.toLowerCase().includes(q)))&&(!cat||p.category===cat));$('products-table').innerHTML=arr.map(p=>`<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.category)}</td><td>${esc(p.size)}</td><td>${money(p.price)}</td><td>${p.stock}</td><td><span class="pill ${status(p.stock)[1]}">${status(p.stock)[0]}</span></td><td><button class="action" data-edit="${p.id}">Edit</button><button class="action danger" data-del="${p.id}">Delete</button></td></tr>`).join('');$('products-empty').style.display=arr.length?'none':'block';document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openProduct(b.dataset.edit));document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>delProduct(b.dataset.del))}function options(){const arr=products.filter(p=>p.stock>0);$('bill-product').innerHTML=arr.length?arr.map(p=>`<option value="${p.id}">${esc(p.name)} (${esc(p.size)}) · ${money(p.price)} · ${p.stock} left</option>`).join(''):'<option value="">No products in stock</option>'}function renderCart(){$('cart').classList.toggle('empty',!cart.length);$('cart').innerHTML=cart.length?cart.map(i=>`<div class="line"><div><strong>${esc(i.name)} (${esc(i.size)})</strong><small>${i.qty} × ${money(i.price)} = ${money(i.qty*i.price)}</small></div><button class="remove" data-remove="${i.productId}">Remove</button></div>`).join(''):'Add a product to start a bill.';const total=cart.reduce((s,i)=>s+i.qty*i.price,0);$('subtotal').textContent=money(total);$('total').textContent=money(total);document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart=cart.filter(i=>i.productId!==b.dataset.remove);renderCart()})}function renderSales(){$('sales-table').innerHTML=[...sales].reverse().map(b=>`<tr><td><b>${esc(b.id)}</b></td><td>${new Date(b.date).toLocaleDateString('en-IN')}</td><td>${esc(b.customer)}</td><td>${b.items.reduce((s,i)=>s+i.qty,0)} unit(s)</td><td>${money(b.total)}</td><td><button class="action" data-print="${b.id}">Print receipt</button></td></tr>`).join('');$('sales-empty').style.display=sales.length?'none':'block';document.querySelectorAll('[data-print]').forEach(b=>b.onclick=()=>receipt(sales.find(x=>x.id===b.dataset.print)))}function render(){dashboard();renderProducts();options();renderSales()}function openProduct(id=''){$('product-form').reset();$('edit-id').value=id;const p=products.find(x=>x.id===id);$('dialog-title').textContent=p?'Edit product':'Add product';if(p){$('p-name').value=p.name;$('p-category').value=p.category;$('p-size').value=p.size;$('p-price').value=p.price;$('p-stock').value=p.stock}$('product-dialog').showModal()}$('add-product').onclick=()=>openProduct();$('quick-add').onclick=()=>{page('products');openProduct()};$('close').onclick=$('cancel').onclick=()=>$('product-dialog').close();$('product-form').onsubmit=e=>{e.preventDefault();const id=$('edit-id').value,name=$('p-name').value.trim(),price=Number($('p-price').value),stock=Number($('p-stock').value);if(!name||price<=0||!Number.isFinite(price)||!Number.isInteger(stock)||stock<0){toast('Enter valid product details.');return}const p={id:id||uid(),name,category:$('p-category').value,size:$('p-size').value,price,stock},ix=products.findIndex(x=>x.id===id);if(ix>=0)products[ix]=p;else products.push(p);save();$('product-dialog').close();render();toast(ix>=0?'Product updated.':'Product added.')};function delProduct(id){const p=products.find(x=>x.id===id);if(p&&confirm(`Delete "${p.name}"?`)){products=products.filter(x=>x.id!==id);cart=cart.filter(x=>x.productId!==id);save();render();renderCart();toast('Product deleted.')}}$('search').oninput=renderProducts;$('filter').onchange=renderProducts;$('add-item').onclick=()=>{const p=products.find(x=>x.id===$('bill-product').value),qty=Number($('qty').value);if(!p){toast('Add a product with stock first.');return}if(!Number.isInteger(qty)||qty<1){toast('Quantity must be at least 1.');return}const old=cart.find(i=>i.productId===p.id);if(qty+(old?.qty||0)>p.stock){toast(`Only ${p.stock} unit(s) available.`);return}if(old)old.qty+=qty;else cart.push({productId:p.id,name:p.name,size:p.size,price:p.price,qty});$('qty').value=1;renderCart();toast('Item added.')};$('clear').onclick=()=>{cart=[];renderCart()};$('complete').onclick=()=>{if(!cart.length){toast('Add at least one item.');return}for(const i of cart){const p=products.find(p=>p.id===i.productId);if(!p||p.stock<i.qty){toast('Please check available stock.');return}}const total=cart.reduce((s,i)=>s+i.qty*i.price,0),bill={id:'TS-'+Date.now().toString().slice(-8),date:new Date().toISOString(),customer:$('customer').value.trim()||'Walk-in customer',phone:$('phone').value.trim(),items:cart.map(i=>({...i})),total};bill.items.forEach(i=>products.find(p=>p.id===i.productId).stock-=i.qty);sales.push(bill);cart=[];save();render();renderCart();$('customer').value='';$('phone').value='';page('sales');toast('Sale saved; stock updated.');receipt(bill)};function receipt(b){const w=window.open('','_blank','width=420,height=650');if(!w){toast('Allow pop-ups to print receipt.');return}w.document.write(`<!doctype html><title>Receipt</title><style>body{font:14px Arial;padding:24px}.row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px dashed #ccc}h1,p{text-align:center}</style><h1>ThreadStock</h1><p>Clothing Store Receipt</p><div class="row"><span>Bill</span><span>${esc(b.id)}</span></div><div class="row"><span>Date</span><span>${new Date(b.date).toLocaleString('en-IN')}</span></div><div class="row"><span>Customer</span><span>${esc(b.customer)}</span></div>${b.items.map(i=>`<div class="row"><span>${esc(i.name)} (${esc(i.size)}) × ${i.qty}</span><span>${money(i.qty*i.price)}</span></div>`).join('')}<div class="row"><b>Total</b><b>${money(b.total)}</b></div><p>Thank you for shopping with us!</p><script>window.onload=()=>window.print()<\/script>`);w.document.close()}$('export').onclick=()=>{if(!sales.length){toast('No sales to export yet.');return}const rows=[['Bill No','Date','Customer','Phone','Items','Total'],...sales.map(b=>[b.id,new Date(b.date).toLocaleString('en-IN'),b.customer,b.phone,b.items.map(i=>`${i.name} (${i.size}) x${i.qty}`).join('; '),b.total.toFixed(2)])],csv=rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n'),blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='threadstock-sales.csv';a.click();URL.revokeObjectURL(url)};render();renderCart()})();
}
