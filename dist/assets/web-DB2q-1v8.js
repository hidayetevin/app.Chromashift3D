import{W as it}from"./index-0VaQ-lCH.js";var oe={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Te=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let a=t.charCodeAt(r);a<128?e[n++]=a:a<2048?(e[n++]=a>>6|192,e[n++]=a&63|128):(a&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(a=65536+((a&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=a>>18|240,e[n++]=a>>12&63|128,e[n++]=a>>6&63|128,e[n++]=a&63|128):(e[n++]=a>>12|224,e[n++]=a>>6&63|128,e[n++]=a&63|128)}return e},ot=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const a=t[n++];if(a<128)e[r++]=String.fromCharCode(a);else if(a>191&&a<224){const s=t[n++];e[r++]=String.fromCharCode((a&31)<<6|s&63)}else if(a>239&&a<365){const s=t[n++],i=t[n++],o=t[n++],c=((a&7)<<18|(s&63)<<12|(i&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const s=t[n++],i=t[n++];e[r++]=String.fromCharCode((a&15)<<12|(s&63)<<6|i&63)}}return e.join("")},De={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let a=0;a<t.length;a+=3){const s=t[a],i=a+1<t.length,o=i?t[a+1]:0,c=a+2<t.length,l=c?t[a+2]:0,f=s>>2,h=(s&3)<<4|o>>4;let g=(o&15)<<2|l>>6,p=l&63;c||(p=64,i||(g=64)),r.push(n[f],n[h],n[g],n[p])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Te(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):ot(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let a=0;a<t.length;){const s=n[t.charAt(a++)],o=a<t.length?n[t.charAt(a)]:0;++a;const l=a<t.length?n[t.charAt(a)]:64;++a;const h=a<t.length?n[t.charAt(a)]:64;if(++a,s==null||o==null||l==null||h==null)throw new ct;const g=s<<2|o>>4;if(r.push(g),l!==64){const p=o<<4&240|l>>2;if(r.push(p),h!==64){const st=l<<6&192|h;r.push(st)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ct extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const lt=function(t){const e=Te(t);return De.encodeByteArray(e,!0)},Ce=function(t){return lt(t).replace(/\./g,"")},dt=function(t){try{return De.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ut(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ft=()=>ut().__FIREBASE_DEFAULTS__,ht=()=>{if(typeof process>"u"||typeof oe>"u")return;const t=oe.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},pt=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&dt(t[1]);return e&&JSON.parse(e)},mt=()=>{try{return ft()||ht()||pt()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Oe=()=>{var t;return(t=mt())===null||t===void 0?void 0:t.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}function bt(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Re(){try{return typeof indexedDB=="object"}catch{return!1}}function Be(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",a=self.indexedDB.open(r);a.onsuccess=()=>{a.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},a.onupgradeneeded=()=>{n=!1},a.onerror=()=>{var s;e(((s=a.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}function yt(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wt="FirebaseError";class C extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=wt,Object.setPrototypeOf(this,C.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,k.prototype.create)}}class k{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},a=`${this.service}/${e}`,s=this.errors[e],i=s?It(s,r):"Error",o=`${this.serviceName}: ${i} (${a}).`;return new C(a,o,r)}}function It(t,e){return t.replace(Et,(n,r)=>{const a=e[r];return a!=null?String(a):`<${r}?>`})}const Et=/\{\$([^}]+)}/g;function M(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const a of n){if(!r.includes(a))return!1;const s=t[a],i=e[a];if(ce(s)&&ce(i)){if(!M(s,i))return!1}else if(s!==i)return!1}for(const a of r)if(!n.includes(a))return!1;return!0}function ce(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _t=1e3,vt=2,At=4*60*60*1e3,St=.5;function le(t,e=_t,n=vt){const r=e*Math.pow(n,t),a=Math.round(St*r*(Math.random()-.5)*2);return Math.min(At,r+a)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(t){return t&&t._delegate?t._delegate:t}class E{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new gt;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const a=this.getOrInitializeService({instanceIdentifier:n});a&&r.resolve(a)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),a=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(a)return null;throw s}else{if(a)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ct(e))try{this.getOrInitializeService({instanceIdentifier:_})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:a});r.resolve(s)}catch{}}}}clearInstance(e=_){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=_){return this.instances.has(e)}getOptions(e=_){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const a=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,i]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&i.resolve(a)}return a}onInit(e,n){var r;const a=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(a))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(a,s);const i=this.instances.get(a);return i&&e(i,a),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const a of r)try{a(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Dt(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=_){return this.component?this.component.multipleInstances?e:_:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Dt(t){return t===_?void 0:t}function Ct(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Tt(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var d;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(d||(d={}));const Rt={debug:d.DEBUG,verbose:d.VERBOSE,info:d.INFO,warn:d.WARN,error:d.ERROR,silent:d.SILENT},Bt=d.INFO,Mt={[d.DEBUG]:"log",[d.VERBOSE]:"log",[d.INFO]:"info",[d.WARN]:"warn",[d.ERROR]:"error"},$t=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),a=Mt[e];if(a)console[a](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Me{constructor(e){this.name=e,this._logLevel=Bt,this._logHandler=$t,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in d))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Rt[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,d.DEBUG,...e),this._logHandler(this,d.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,d.VERBOSE,...e),this._logHandler(this,d.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,d.INFO,...e),this._logHandler(this,d.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,d.WARN,...e),this._logHandler(this,d.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,d.ERROR,...e),this._logHandler(this,d.ERROR,...e)}}const Pt=(t,e)=>e.some(n=>t instanceof n);let de,ue;function Nt(){return de||(de=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function kt(){return ue||(ue=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const $e=new WeakMap,K=new WeakMap,Pe=new WeakMap,H=new WeakMap,te=new WeakMap;function Ft(t){const e=new Promise((n,r)=>{const a=()=>{t.removeEventListener("success",s),t.removeEventListener("error",i)},s=()=>{n(y(t.result)),a()},i=()=>{r(t.error),a()};t.addEventListener("success",s),t.addEventListener("error",i)});return e.then(n=>{n instanceof IDBCursor&&$e.set(n,t)}).catch(()=>{}),te.set(e,t),e}function Lt(t){if(K.has(t))return;const e=new Promise((n,r)=>{const a=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",i),t.removeEventListener("abort",i)},s=()=>{n(),a()},i=()=>{r(t.error||new DOMException("AbortError","AbortError")),a()};t.addEventListener("complete",s),t.addEventListener("error",i),t.addEventListener("abort",i)});K.set(t,e)}let Y={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return K.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Pe.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return y(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function xt(t){Y=t(Y)}function jt(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(U(this),e,...n);return Pe.set(r,e.sort?e.sort():[e]),y(r)}:kt().includes(t)?function(...e){return t.apply(U(this),e),y($e.get(this))}:function(...e){return y(t.apply(U(this),e))}}function Ht(t){return typeof t=="function"?jt(t):(t instanceof IDBTransaction&&Lt(t),Pt(t,Nt())?new Proxy(t,Y):t)}function y(t){if(t instanceof IDBRequest)return Ft(t);if(H.has(t))return H.get(t);const e=Ht(t);return e!==t&&(H.set(t,e),te.set(e,t)),e}const U=t=>te.get(t);function Ne(t,e,{blocked:n,upgrade:r,blocking:a,terminated:s}={}){const i=indexedDB.open(t,e),o=y(i);return r&&i.addEventListener("upgradeneeded",c=>{r(y(i.result),c.oldVersion,c.newVersion,y(i.transaction),c)}),n&&i.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),o.then(c=>{s&&c.addEventListener("close",()=>s()),a&&c.addEventListener("versionchange",l=>a(l.oldVersion,l.newVersion,l))}).catch(()=>{}),o}const Ut=["get","getKey","getAll","getAllKeys","count"],Vt=["put","add","delete","clear"],V=new Map;function fe(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(V.get(e))return V.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,a=Vt.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(a||Ut.includes(n)))return;const s=async function(i,...o){const c=this.transaction(i,a?"readwrite":"readonly");let l=c.store;return r&&(l=l.index(o.shift())),(await Promise.all([l[n](...o),a&&c.done]))[0]};return V.set(e,s),s}xt(t=>({...t,get:(e,n,r)=>fe(e,n)||t.get(e,n,r),has:(e,n)=>!!fe(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Wt(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Wt(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const J="@firebase/app",he="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b=new Me("@firebase/app"),qt="@firebase/app-compat",Gt="@firebase/analytics-compat",Kt="@firebase/analytics",Yt="@firebase/app-check-compat",Jt="@firebase/app-check",Xt="@firebase/auth",Zt="@firebase/auth-compat",Qt="@firebase/database",en="@firebase/data-connect",tn="@firebase/database-compat",nn="@firebase/functions",rn="@firebase/functions-compat",an="@firebase/installations",sn="@firebase/installations-compat",on="@firebase/messaging",cn="@firebase/messaging-compat",ln="@firebase/performance",dn="@firebase/performance-compat",un="@firebase/remote-config",fn="@firebase/remote-config-compat",hn="@firebase/storage",pn="@firebase/storage-compat",mn="@firebase/firestore",gn="@firebase/vertexai-preview",bn="@firebase/firestore-compat",yn="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X="[DEFAULT]",wn={[J]:"fire-core",[qt]:"fire-core-compat",[Kt]:"fire-analytics",[Gt]:"fire-analytics-compat",[Jt]:"fire-app-check",[Yt]:"fire-app-check-compat",[Xt]:"fire-auth",[Zt]:"fire-auth-compat",[Qt]:"fire-rtdb",[en]:"fire-data-connect",[tn]:"fire-rtdb-compat",[nn]:"fire-fn",[rn]:"fire-fn-compat",[an]:"fire-iid",[sn]:"fire-iid-compat",[on]:"fire-fcm",[cn]:"fire-fcm-compat",[ln]:"fire-perf",[dn]:"fire-perf-compat",[un]:"fire-rc",[fn]:"fire-rc-compat",[hn]:"fire-gcs",[pn]:"fire-gcs-compat",[mn]:"fire-fst",[bn]:"fire-fst-compat",[gn]:"fire-vertex","fire-js":"fire-js",[yn]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $=new Map,In=new Map,Z=new Map;function pe(t,e){try{t.container.addComponent(e)}catch(n){b.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function S(t){const e=t.name;if(Z.has(e))return b.debug(`There were multiple attempts to register component ${e}.`),!1;Z.set(e,t);for(const n of $.values())pe(n,t);for(const n of In.values())pe(n,t);return!0}function F(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const En={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},w=new k("app","Firebase",En);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new E("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw w.create("app-deleted",{appName:this._name})}}function vn(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:X,automaticDataCollectionEnabled:!1},e),a=r.name;if(typeof a!="string"||!a)throw w.create("bad-app-name",{appName:String(a)});if(n||(n=Oe()),!n)throw w.create("no-options");const s=$.get(a);if(s){if(M(n,s.options)&&M(r,s.config))return s;throw w.create("duplicate-app",{appName:a})}const i=new Ot(a);for(const c of Z.values())i.addComponent(c);const o=new _n(n,r,i);return $.set(a,o),o}function An(t=X){const e=$.get(t);if(!e&&t===X&&Oe())return vn();if(!e)throw w.create("no-app",{appName:t});return e}function A(t,e,n){var r;let a=(r=wn[t])!==null&&r!==void 0?r:t;n&&(a+=`-${n}`);const s=a.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${a}" with version "${e}":`];s&&o.push(`library name "${a}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),b.warn(o.join(" "));return}S(new E(`${a}-version`,()=>({library:a,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sn="firebase-heartbeat-database",Tn=1,R="firebase-heartbeat-store";let z=null;function ke(){return z||(z=Ne(Sn,Tn,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(R)}catch(n){console.warn(n)}}}}).catch(t=>{throw w.create("idb-open",{originalErrorMessage:t.message})})),z}async function Dn(t){try{const n=(await ke()).transaction(R),r=await n.objectStore(R).get(Fe(t));return await n.done,r}catch(e){if(e instanceof C)b.warn(e.message);else{const n=w.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});b.warn(n.message)}}}async function me(t,e){try{const r=(await ke()).transaction(R,"readwrite");await r.objectStore(R).put(e,Fe(t)),await r.done}catch(n){if(n instanceof C)b.warn(n.message);else{const r=w.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});b.warn(r.message)}}}function Fe(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cn=1024,On=30*24*60*60*1e3;class Rn{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Mn(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const a=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=ge();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(i=>i.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:a}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(i=>{const o=new Date(i.date).valueOf();return Date.now()-o<=On}),this._storage.overwrite(this._heartbeatsCache))}catch(r){b.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=ge(),{heartbeatsToSend:r,unsentEntries:a}=Bn(this._heartbeatsCache.heartbeats),s=Ce(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,a.length>0?(this._heartbeatsCache.heartbeats=a,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return b.warn(n),""}}}function ge(){return new Date().toISOString().substring(0,10)}function Bn(t,e=Cn){const n=[];let r=t.slice();for(const a of t){const s=n.find(i=>i.agent===a.agent);if(s){if(s.dates.push(a.date),be(n)>e){s.dates.pop();break}}else if(n.push({agent:a.agent,dates:[a.date]}),be(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Mn{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Re()?Be().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Dn(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const a=await this.read();return me(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:a.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const a=await this.read();return me(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:a.lastSentHeartbeatDate,heartbeats:[...a.heartbeats,...e.heartbeats]})}else return}}function be(t){return Ce(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $n(t){S(new E("platform-logger",e=>new zt(e),"PRIVATE")),S(new E("heartbeat",e=>new Rn(e),"PRIVATE")),A(J,he,t),A(J,he,"esm2017"),A("fire-js","")}$n("");const Le="@firebase/installations",ne="0.6.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xe=1e4,je=`w:${ne}`,He="FIS_v2",Pn="https://firebaseinstallations.googleapis.com/v1",Nn=60*60*1e3,kn="installations",Fn="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ln={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},T=new k(kn,Fn,Ln);function Ue(t){return t instanceof C&&t.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ve({projectId:t}){return`${Pn}/projects/${t}/installations`}function ze(t){return{token:t.token,requestStatus:2,expiresIn:jn(t.expiresIn),creationTime:Date.now()}}async function We(t,e){const r=(await e.json()).error;return T.create("request-failed",{requestName:t,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function qe({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function xn(t,{refreshToken:e}){const n=qe(t);return n.append("Authorization",Hn(e)),n}async function Ge(t){const e=await t();return e.status>=500&&e.status<600?t():e}function jn(t){return Number(t.replace("s","000"))}function Hn(t){return`${He} ${t}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Un({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=Ve(t),a=qe(t),s=e.getImmediate({optional:!0});if(s){const l=await s.getHeartbeatsHeader();l&&a.append("x-firebase-client",l)}const i={fid:n,authVersion:He,appId:t.appId,sdkVersion:je},o={method:"POST",headers:a,body:JSON.stringify(i)},c=await Ge(()=>fetch(r,o));if(c.ok){const l=await c.json();return{fid:l.fid||n,registrationStatus:2,refreshToken:l.refreshToken,authToken:ze(l.authToken)}}else throw await We("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ke(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vn(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zn=/^[cdef][\w-]{21}$/,Q="";function Wn(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=qn(t);return zn.test(n)?n:Q}catch{return Q}}function qn(t){return Vn(t).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L(t){return`${t.appName}!${t.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye=new Map;function Je(t,e){const n=L(t);Xe(n,e),Gn(n,e)}function Xe(t,e){const n=Ye.get(t);if(n)for(const r of n)r(e)}function Gn(t,e){const n=Kn();n&&n.postMessage({key:t,fid:e}),Yn()}let v=null;function Kn(){return!v&&"BroadcastChannel"in self&&(v=new BroadcastChannel("[Firebase] FID Change"),v.onmessage=t=>{Xe(t.data.key,t.data.fid)}),v}function Yn(){Ye.size===0&&v&&(v.close(),v=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jn="firebase-installations-database",Xn=1,D="firebase-installations-store";let W=null;function re(){return W||(W=Ne(Jn,Xn,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(D)}}})),W}async function P(t,e){const n=L(t),a=(await re()).transaction(D,"readwrite"),s=a.objectStore(D),i=await s.get(n);return await s.put(e,n),await a.done,(!i||i.fid!==e.fid)&&Je(t,e.fid),e}async function Ze(t){const e=L(t),r=(await re()).transaction(D,"readwrite");await r.objectStore(D).delete(e),await r.done}async function x(t,e){const n=L(t),a=(await re()).transaction(D,"readwrite"),s=a.objectStore(D),i=await s.get(n),o=e(i);return o===void 0?await s.delete(n):await s.put(o,n),await a.done,o&&(!i||i.fid!==o.fid)&&Je(t,o.fid),o}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ae(t){let e;const n=await x(t.appConfig,r=>{const a=Zn(r),s=Qn(t,a);return e=s.registrationPromise,s.installationEntry});return n.fid===Q?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function Zn(t){const e=t||{fid:Wn(),registrationStatus:0};return Qe(e)}function Qn(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const a=Promise.reject(T.create("app-offline"));return{installationEntry:e,registrationPromise:a}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=er(t,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:tr(t)}:{installationEntry:e}}async function er(t,e){try{const n=await Un(t,e);return P(t.appConfig,n)}catch(n){throw Ue(n)&&n.customData.serverCode===409?await Ze(t.appConfig):await P(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function tr(t){let e=await ye(t.appConfig);for(;e.registrationStatus===1;)await Ke(100),e=await ye(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await ae(t);return r||n}return e}function ye(t){return x(t,e=>{if(!e)throw T.create("installation-not-found");return Qe(e)})}function Qe(t){return nr(t)?{fid:t.fid,registrationStatus:0}:t}function nr(t){return t.registrationStatus===1&&t.registrationTime+xe<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rr({appConfig:t,heartbeatServiceProvider:e},n){const r=ar(t,n),a=xn(t,n),s=e.getImmediate({optional:!0});if(s){const l=await s.getHeartbeatsHeader();l&&a.append("x-firebase-client",l)}const i={installation:{sdkVersion:je,appId:t.appId}},o={method:"POST",headers:a,body:JSON.stringify(i)},c=await Ge(()=>fetch(r,o));if(c.ok){const l=await c.json();return ze(l)}else throw await We("Generate Auth Token",c)}function ar(t,{fid:e}){return`${Ve(t)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function se(t,e=!1){let n;const r=await x(t.appConfig,s=>{if(!et(s))throw T.create("not-registered");const i=s.authToken;if(!e&&or(i))return s;if(i.requestStatus===1)return n=sr(t,e),s;{if(!navigator.onLine)throw T.create("app-offline");const o=lr(s);return n=ir(t,o),o}});return n?await n:r.authToken}async function sr(t,e){let n=await we(t.appConfig);for(;n.authToken.requestStatus===1;)await Ke(100),n=await we(t.appConfig);const r=n.authToken;return r.requestStatus===0?se(t,e):r}function we(t){return x(t,e=>{if(!et(e))throw T.create("not-registered");const n=e.authToken;return dr(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function ir(t,e){try{const n=await rr(t,e),r=Object.assign(Object.assign({},e),{authToken:n});return await P(t.appConfig,r),n}catch(n){if(Ue(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await Ze(t.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await P(t.appConfig,r)}throw n}}function et(t){return t!==void 0&&t.registrationStatus===2}function or(t){return t.requestStatus===2&&!cr(t)}function cr(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+Nn}function lr(t){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},t),{authToken:e})}function dr(t){return t.requestStatus===1&&t.requestTime+xe<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ur(t){const e=t,{installationEntry:n,registrationPromise:r}=await ae(e);return r?r.catch(console.error):se(e).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fr(t,e=!1){const n=t;return await hr(n),(await se(n,e)).token}async function hr(t){const{registrationPromise:e}=await ae(t);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pr(t){if(!t||!t.options)throw q("App Configuration");if(!t.name)throw q("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw q(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function q(t){return T.create("missing-app-config-values",{valueName:t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt="installations",mr="installations-internal",gr=t=>{const e=t.getProvider("app").getImmediate(),n=pr(e),r=F(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},br=t=>{const e=t.getProvider("app").getImmediate(),n=F(e,tt).getImmediate();return{getId:()=>ur(n),getToken:a=>fr(n,a)}};function yr(){S(new E(tt,gr,"PUBLIC")),S(new E(mr,br,"PRIVATE"))}yr();A(Le,ne);A(Le,ne,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N="analytics",wr="firebase_id",Ir="origin",Er=60*1e3,_r="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",ie="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const u=new Me("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vr={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},m=new k("analytics","Analytics",vr);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ar(t){if(!t.startsWith(ie)){const e=m.create("invalid-gtag-resource",{gtagURL:t});return u.warn(e.message),""}return t}function nt(t){return Promise.all(t.map(e=>e.catch(n=>n)))}function Sr(t,e){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(t,e)),n}function Tr(t,e){const n=Sr("firebase-js-sdk-policy",{createScriptURL:Ar}),r=document.createElement("script"),a=`${ie}?l=${t}&id=${e}`;r.src=n?n==null?void 0:n.createScriptURL(a):a,r.async=!0,document.head.appendChild(r)}function Dr(t){let e=[];return Array.isArray(window[t])?e=window[t]:window[t]=e,e}async function Cr(t,e,n,r,a,s){const i=r[a];try{if(i)await e[i];else{const c=(await nt(n)).find(l=>l.measurementId===a);c&&await e[c.appId]}}catch(o){u.error(o)}t("config",a,s)}async function Or(t,e,n,r,a){try{let s=[];if(a&&a.send_to){let i=a.send_to;Array.isArray(i)||(i=[i]);const o=await nt(n);for(const c of i){const l=o.find(h=>h.measurementId===c),f=l&&e[l.appId];if(f)s.push(f);else{s=[];break}}}s.length===0&&(s=Object.values(e)),await Promise.all(s),t("event",r,a||{})}catch(s){u.error(s)}}function Rr(t,e,n,r){async function a(s,...i){try{if(s==="event"){const[o,c]=i;await Or(t,e,n,o,c)}else if(s==="config"){const[o,c]=i;await Cr(t,e,n,r,o,c)}else if(s==="consent"){const[o,c]=i;t("consent",o,c)}else if(s==="get"){const[o,c,l]=i;t("get",o,c,l)}else if(s==="set"){const[o]=i;t("set",o)}else t(s,...i)}catch(o){u.error(o)}}return a}function Br(t,e,n,r,a){let s=function(...i){window[r].push(arguments)};return window[a]&&typeof window[a]=="function"&&(s=window[a]),window[a]=Rr(s,t,e,n),{gtagCore:s,wrappedGtag:window[a]}}function Mr(t){const e=window.document.getElementsByTagName("script");for(const n of Object.values(e))if(n.src&&n.src.includes(ie)&&n.src.includes(t))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $r=30,Pr=1e3;class Nr{constructor(e={},n=Pr){this.throttleMetadata=e,this.intervalMillis=n}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,n){this.throttleMetadata[e]=n}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const rt=new Nr;function kr(t){return new Headers({Accept:"application/json","x-goog-api-key":t})}async function Fr(t){var e;const{appId:n,apiKey:r}=t,a={method:"GET",headers:kr(r)},s=_r.replace("{app-id}",n),i=await fetch(s,a);if(i.status!==200&&i.status!==304){let o="";try{const c=await i.json();!((e=c.error)===null||e===void 0)&&e.message&&(o=c.error.message)}catch{}throw m.create("config-fetch-failed",{httpStatus:i.status,responseMessage:o})}return i.json()}async function Lr(t,e=rt,n){const{appId:r,apiKey:a,measurementId:s}=t.options;if(!r)throw m.create("no-app-id");if(!a){if(s)return{measurementId:s,appId:r};throw m.create("no-api-key")}const i=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},o=new Hr;return setTimeout(async()=>{o.abort()},Er),at({appId:r,apiKey:a,measurementId:s},i,o,e)}async function at(t,{throttleEndTimeMillis:e,backoffCount:n},r,a=rt){var s;const{appId:i,measurementId:o}=t;try{await xr(r,e)}catch(c){if(o)return u.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:i,measurementId:o};throw c}try{const c=await Fr(t);return a.deleteThrottleMetadata(i),c}catch(c){const l=c;if(!jr(l)){if(a.deleteThrottleMetadata(i),o)return u.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${l==null?void 0:l.message}]`),{appId:i,measurementId:o};throw c}const f=Number((s=l==null?void 0:l.customData)===null||s===void 0?void 0:s.httpStatus)===503?le(n,a.intervalMillis,$r):le(n,a.intervalMillis),h={throttleEndTimeMillis:Date.now()+f,backoffCount:n+1};return a.setThrottleMetadata(i,h),u.debug(`Calling attemptFetch again in ${f} millis`),at(t,h,r,a)}}function xr(t,e){return new Promise((n,r)=>{const a=Math.max(e-Date.now(),0),s=setTimeout(n,a);t.addEventListener(()=>{clearTimeout(s),r(m.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function jr(t){if(!(t instanceof C)||!t.customData)return!1;const e=Number(t.customData.httpStatus);return e===429||e===500||e===503||e===504}class Hr{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function Ur(t,e,n,r,a){if(a&&a.global){t("event",n,r);return}else{const s=await e,i=Object.assign(Object.assign({},r),{send_to:s});t("event",n,i)}}async function Vr(t,e,n,r){{const a=await e;t("config",a,{update:!0,user_id:n})}}async function zr(t,e,n,r){{const a=await e;t("config",a,{update:!0,user_properties:n})}}async function Wr(t,e){const n=await t;window[`ga-disable-${n}`]=!e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qr(){if(Re())try{await Be()}catch(t){return u.warn(m.create("indexeddb-unavailable",{errorInfo:t==null?void 0:t.toString()}).message),!1}else return u.warn(m.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Gr(t,e,n,r,a,s,i){var o;const c=Lr(t);c.then(p=>{n[p.measurementId]=p.appId,t.options.measurementId&&p.measurementId!==t.options.measurementId&&u.warn(`The measurement ID in the local Firebase config (${t.options.measurementId}) does not match the measurement ID fetched from the server (${p.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(p=>u.error(p)),e.push(c);const l=qr().then(p=>{if(p)return r.getId()}),[f,h]=await Promise.all([c,l]);Mr(s)||Tr(s,f.measurementId),a("js",new Date);const g=(o=i==null?void 0:i.config)!==null&&o!==void 0?o:{};return g[Ir]="firebase",g.update=!0,h!=null&&(g[wr]=h),a("config",f.measurementId,g),f.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(e){this.app=e}_delete(){return delete I[this.app.options.appId],Promise.resolve()}}let I={},Ie=[];const Ee={};let G="dataLayer",Yr="gtag",_e,j,ve=!1;function Jr(){const t=[];if(bt()&&t.push("This is a browser extension environment."),yt()||t.push("Cookies are not available."),t.length>0){const e=t.map((r,a)=>`(${a+1}) ${r}`).join(" "),n=m.create("invalid-analytics-context",{errorInfo:e});u.warn(n.message)}}function Xr(t,e,n){Jr();const r=t.options.appId;if(!r)throw m.create("no-app-id");if(!t.options.apiKey)if(t.options.measurementId)u.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${t.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw m.create("no-api-key");if(I[r]!=null)throw m.create("already-exists",{id:r});if(!ve){Dr(G);const{wrappedGtag:s,gtagCore:i}=Br(I,Ie,Ee,G,Yr);j=s,_e=i,ve=!0}return I[r]=Gr(t,Ie,Ee,e,_e,G,n),new Kr(t)}function O(t=An()){t=B(t);const e=F(t,N);return e.isInitialized()?e.getImmediate():Zr(t)}function Zr(t,e={}){const n=F(t,N);if(n.isInitialized()){const a=n.getImmediate();if(M(e,n.getOptions()))return a;throw m.create("already-initialized")}return n.initialize({options:e})}function Qr(t,e,n){t=B(t),Vr(j,I[t.app.options.appId],e).catch(r=>u.error(r))}function ea(t,e,n){t=B(t),zr(j,I[t.app.options.appId],e).catch(r=>u.error(r))}function ta(t,e){t=B(t),Wr(I[t.app.options.appId],e).catch(n=>u.error(n))}function ee(t,e,n,r){t=B(t),Ur(j,I[t.app.options.appId],e,n,r).catch(a=>u.error(a))}const Ae="@firebase/analytics",Se="0.10.8";function na(){S(new E(N,(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),a=e.getProvider("installations-internal").getImmediate();return Xr(r,a,n)},"PUBLIC")),S(new E("analytics-internal",t,"PRIVATE")),A(Ae,Se),A(Ae,Se,"esm2017");function t(e){try{const n=e.getProvider(N).getImmediate();return{logEvent:(r,a,s)=>ee(n,r,a,s)}}catch(n){throw m.create("interop-component-reg-failed",{reason:n})}}}na();class aa extends it{async getAppInstanceId(){throw this.unimplemented("Not implemented on web.")}async setUserId(e){const n=O();Qr(n,e.userId||"")}async setUserProperty(e){const n=O();ea(n,{[e.key]:e.value})}async setCurrentScreen(e){const n=O();ee(n,"screen_view",{firebase_screen:e.screenName||void 0,firebase_screen_class:e.screenClassOverride||void 0})}async logEvent(e){const n=O();ee(n,e.name,e.params)}async setSessionTimeoutDuration(e){throw this.unimplemented("Not implemented on web.")}async setEnabled(e){const n=O();ta(n,e.enabled)}async isEnabled(){return{enabled:window["ga-disable-analyticsId"]===!0}}async resetAnalyticsData(){throw this.unimplemented("Not implemented on web.")}}export{aa as FirebaseAnalyticsWeb};
