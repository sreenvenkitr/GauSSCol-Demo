(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{Module;constructor(e){this.Module=e}loadSplatData(e){console.log(`WasmBridge: loadSplatData started, size:`,e.byteLength);let t=e.byteLength;console.log(`WasmBridge: allocating`,t,`bytes on WASM heap...`);let n=this.Module._malloc(t);console.log(`WasmBridge: allocated ptr:`,n);let r=new Uint8Array(e);console.log(`WasmBridge: copying data to heap...`),this.Module.HEAPU8.set(r,n),console.log(`WasmBridge: calling _loadSplatData in WASM...`),this.Module._loadSplatData(n,t),console.log(`WasmBridge: _loadSplatData returned. Freeing ptr...`),this.Module._free(n),console.log(`WasmBridge: loadSplatData complete.`)}renderFrame(e,t,n){this.Module._renderFrame(e,t,n)}cameraOrbit(e,t){this.Module._cameraOrbit(e,t)}cameraZoom(e){this.Module._cameraZoom(e)}cameraPan(e,t){this.Module._cameraPan(e,t)}cameraReset(){this.Module._cameraReset()}lassoBegin(){this.Module._lassoBegin()}lassoAddPoint(e,t){this.Module._lassoAddPoint(e,t)}lassoCommit(e,t){this.Module._lassoCommit(+!!e,+!!t)}clearSelection(){this.Module._clearSelection()}getSelectionCount(){return this.Module._getSelectionCount()}deleteSelected(){this.Module._deleteSelected()}setClusterMask(e){let t=this.Module._malloc(e.byteLength);this.Module.HEAPU8.set(e,t),this.Module._setClusterMask(t,e.byteLength),this.Module._free(t)}setGridEnabled(e){this.Module._setGridEnabled(+!!e)}getModule(){return this.Module}},t=class{canvas;wasm;isDragging=!1;startX=0;startY=0;isPanning=!1;activeControls={rotateUp:!1,rotateDown:!1,rotateLeft:!1,rotateRight:!1,zoomIn:!1,zoomOut:!1};constructor(e,t){this.canvas=e,this.wasm=t,this.setupPointerEvents(),this.setupKeyboardEvents()}setupPointerEvents(){this.canvas.addEventListener(`contextmenu`,e=>e.preventDefault()),this.canvas.addEventListener(`mousedown`,e=>{window.selectionMode===`lasso`||window.selectionMode===`brush`||(e.button===0?(this.isDragging=!0,this.startX=e.clientX,this.startY=e.clientY,this.isPanning=e.shiftKey):e.button===2&&(this.isDragging=!0,this.startX=e.clientX,this.startY=e.clientY,this.isPanning=!0))}),window.addEventListener(`mousemove`,e=>{if(!this.isDragging)return;let t=e.clientX-this.startX,n=e.clientY-this.startY;this.startX=e.clientX,this.startY=e.clientY,this.isPanning?this.wasm.cameraPan(t,n):this.wasm.cameraOrbit(t*.005,-n*.005)}),window.addEventListener(`mouseup`,()=>{this.isDragging=!1}),this.canvas.addEventListener(`wheel`,e=>{this.wasm.cameraZoom(e.deltaY*.001)})}setupKeyboardEvents(){window.addEventListener(`keydown`,e=>{let t=e.key.toLowerCase();[`arrowup`,`arrowdown`,`arrowleft`,`arrowright`,`w`,`s`,`a`,`d`,`q`,`e`].includes(t)&&e.preventDefault(),(t===`arrowup`||t===`w`)&&(this.activeControls.rotateUp=!0),(t===`arrowdown`||t===`s`)&&(this.activeControls.rotateDown=!0),(t===`arrowleft`||t===`a`)&&(this.activeControls.rotateLeft=!0),(t===`arrowright`||t===`d`)&&(this.activeControls.rotateRight=!0),(t===`e`||e.key===`+`||e.key===`=`)&&(this.activeControls.zoomIn=!0),(t===`q`||e.key===`-`)&&(this.activeControls.zoomOut=!0),t===`r`&&this.wasm.cameraReset()}),window.addEventListener(`keyup`,e=>{let t=e.key.toLowerCase();(t===`arrowup`||t===`w`)&&(this.activeControls.rotateUp=!1),(t===`arrowdown`||t===`s`)&&(this.activeControls.rotateDown=!1),(t===`arrowleft`||t===`a`)&&(this.activeControls.rotateLeft=!1),(t===`arrowright`||t===`d`)&&(this.activeControls.rotateRight=!1),(t===`e`||e.key===`+`||e.key===`=`)&&(this.activeControls.zoomIn=!1),(t===`q`||e.key===`-`)&&(this.activeControls.zoomOut=!1)})}updateContinuous(e){let t=1.8;this.activeControls.rotateLeft&&this.wasm.cameraOrbit(-1.8*e,0),this.activeControls.rotateRight&&this.wasm.cameraOrbit(t*e,0),this.activeControls.rotateUp&&this.wasm.cameraOrbit(0,-1.8*e),this.activeControls.rotateDown&&this.wasm.cameraOrbit(0,t*e),this.activeControls.zoomIn&&this.wasm.cameraZoom(-2*e),this.activeControls.zoomOut&&this.wasm.cameraZoom(2*e)}},n=class{canvas;wasm;isDrawing=!1;onSelectionChanged;constructor(e,t,n){this.canvas=e,this.wasm=t,this.onSelectionChanged=n,this.setupLassoEvents()}setupLassoEvents(){this.canvas.addEventListener(`mousedown`,e=>{if(window.selectionMode!==`lasso`||e.button!==0)return;this.isDrawing=!0,this.wasm.lassoBegin();let t=this.canvas.getBoundingClientRect(),n=window.devicePixelRatio||1,r=(e.clientX-t.left)*n,i=(e.clientY-t.top)*n;this.wasm.lassoAddPoint(r,i)}),window.addEventListener(`mousemove`,e=>{if(!this.isDrawing||window.selectionMode!==`lasso`)return;let t=this.canvas.getBoundingClientRect(),n=window.devicePixelRatio||1,r=(e.clientX-t.left)*n,i=(e.clientY-t.top)*n;this.wasm.lassoAddPoint(r,i)}),window.addEventListener(`mouseup`,e=>{this.isDrawing&&(this.isDrawing=!1,this.wasm.lassoCommit(e.shiftKey,e.ctrlKey),this.onSelectionChanged())})}},r=class{parent;callbacks;element=null;sectionCollapsed=!1;displayCollapsed=!1;selectionCount=0;showGrid=!0;constructor(e,t,n){this.parent=e,this.callbacks=n,this.createPanel()}updateSelectionCount(e){this.selectionCount=e,this.render()}setGridEnabled(e){this.showGrid=e,this.render()}createPanel(){this.element=document.createElement(`div`),this.element.id=`editor-side-panel`,this.element.style.cssText=`
            position: absolute;
            top: 20px;
            right: 20px;
            width: 290px;
            max-height: calc(100vh - 40px);
            color: white;
            background: rgba(18, 18, 18, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            font-family: 'Outfit', 'Inter', sans-serif;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
            z-index: 100;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            user-select: none;
            scrollbar-width: thin;
        `,this.parent.appendChild(this.element),this.render()}render(){if(!this.element)return;let e=window.selectionMode||`orbit`;this.element.innerHTML=`
            <style>
                .panel-section-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .panel-section-header:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                .panel-section-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #a5b4fc;
                }
                .panel-section-content {
                    padding: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .mode-btn {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.7);
                    padding: 7px 0;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .mode-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                .mode-btn.active {
                    background: rgba(99, 102, 241, 0.2);
                    border-color: #818cf8;
                    color: #a5b4fc;
                    box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
                }
                .panel-btn {
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .panel-btn:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.15);
                }
                .panel-btn:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }
            </style>

            <!-- Panel Title / Header -->
            <div style="padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">🌌</span>
                <span style="font-weight: 700; font-size: 15px; letter-spacing: 0.5px; background: linear-gradient(135deg, #a5b4fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">GauSSCol Editor</span>
            </div>

            <!-- File Loading Button -->
            <div style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 8px;">
                <button class="panel-btn" id="btn-load-file" style="width: 100%; background: #818cf8; border-color: rgba(129, 140, 248, 0.4);">📁 Load .splat File</button>
                <button class="panel-btn" id="btn-load-demo" style="width: 100%; background: rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.2); color: #a5b4fc;">📦 Load Demo Room (36MB)</button>
            </div>

            <!-- SECTION: Selection & Editing -->
            <div class="panel-section-header" id="header-sec">
                <span class="panel-section-title">🪄 Selection Tools</span>
                <span style="font-size: 10px; color: rgba(255,255,255,0.4);">${this.sectionCollapsed?`▼`:`▲`}</span>
            </div>
            <div class="panel-section-content" id="content-sec" style="display: ${this.sectionCollapsed?`none`:`block`};">
                <!-- Selection Mode Buttons -->
                <div style="display: flex; gap: 6px; margin-bottom: 16px;">
                    <button class="mode-btn ${e===`orbit`?`active`:``}" id="mode-orbit">Orbit</button>
                    <button class="mode-btn ${e===`lasso`?`active`:``}" id="mode-lasso">Lasso</button>
                </div>

                <!-- Selected Badge & Clear / Delete -->
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 10px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-size: 11px; color: rgba(255, 255, 255, 0.55);">Selected Splats:</span>
                        <span style="font-size: 11px; font-weight: 700; color: ${this.selectionCount>0?`#00e5ff`:`rgba(255, 255, 255, 0.4)`};">${this.selectionCount.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button class="panel-btn" id="btn-deselect" style="flex: 1;" ${this.selectionCount>0?``:`disabled`}>Clear</button>
                        <button class="panel-btn" id="btn-delete" style="flex: 1; background: rgba(244, 63, 94, 0.15); border-color: rgba(244, 63, 94, 0.2); color: #f43f5e;" ${this.selectionCount>0?``:`disabled`}>Delete</button>
                    </div>
                </div>
            </div>

            <!-- SECTION: Display Options -->
            <div class="panel-section-header" id="header-display-sec">
                <span class="panel-section-title">🖥️ Display Options</span>
                <span style="font-size: 10px; color: rgba(255,255,255,0.4);">${this.displayCollapsed?`▼`:`▲`}</span>
            </div>
            <div class="panel-section-content" id="content-display-sec" style="display: ${this.displayCollapsed?`none`:`block`};">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 11px; color: rgba(255, 255, 255, 0.755);">Show Grid & Axes</span>
                    <input type="checkbox" id="toggle-grid" ${this.showGrid?`checked`:``} style="cursor: pointer;" />
                </div>
            </div>
        `,this.bindEvents()}bindEvents(){this.element&&(this.element.querySelector(`#header-sec`)?.addEventListener(`click`,()=>{this.sectionCollapsed=!this.sectionCollapsed,this.render()}),this.element.querySelector(`#header-display-sec`)?.addEventListener(`click`,()=>{this.displayCollapsed=!this.displayCollapsed,this.render()}),this.element.querySelector(`#mode-orbit`)?.addEventListener(`click`,()=>{this.callbacks.onSelectionModeChanged(`orbit`),this.render()}),this.element.querySelector(`#mode-lasso`)?.addEventListener(`click`,()=>{this.callbacks.onSelectionModeChanged(`lasso`),this.render()}),this.element.querySelector(`#btn-deselect`)?.addEventListener(`click`,()=>{this.callbacks.onClearSelection()}),this.element.querySelector(`#btn-delete`)?.addEventListener(`click`,()=>{confirm(`Are you sure you want to delete the selected splats?`)&&this.callbacks.onDeleteSelected()}),this.element.querySelector(`#btn-load-file`)?.addEventListener(`click`,()=>{this.callbacks.onLoadFile()}),this.element.querySelector(`#btn-load-demo`)?.addEventListener(`click`,()=>{this.callbacks.onLoadDemo()}),this.element.querySelector(`#toggle-grid`)?.addEventListener(`change`,e=>{let t=e.target;this.showGrid=t.checked,this.callbacks.onToggleGrid(this.showGrid)}))}},i=e=>`./`+(e.startsWith(`/`)?e.substring(1):e);async function a(){document.querySelector(`#app`).innerHTML=`
        <div style="position: relative; width: 100vw; height: 100vh; background: #000; overflow: hidden; user-select: none;">
            <canvas id="canvas" style="width: 100%; height: 100%; display: block;"></canvas>
            
            <!-- Loading Indicator Overlay -->
            <div id="loading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; background: rgba(0,0,0,0.85); padding: 25px; border-radius: 12px; font-family: 'Outfit', sans-serif; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); z-index: 200;">
                <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px; color: #818cf8;">Gaussian Splatting WebGPU</div>
                <div id="status-text">Initializing WebGPU...</div>
            </div>

            <!-- On-Screen Telemetry Info -->
            <div style="position: absolute; top: 20px; left: 20px; color: rgba(255,255,255,0.7); background: rgba(0,0,0,0.6); padding: 15px; border-radius: 8px; font-family: sans-serif; font-size: 13px; line-height: 1.6; border: 1px solid rgba(255,255,255,0.05); pointer-events: none; z-index: 100;">
                <strong style="color: white; font-size: 14px;">Controls:</strong><br/>
                • Left-drag / Arrows / WASD to Rotate View<br/>
                • Right-drag / Shift-drag to Pan View<br/>
                • Scroll Wheel / Q / E to Zoom View<br/>
                • Press 'R' to Reset View Position<br/>
                <span id="fps-display" style="color: #818cf8; font-size: 12px; font-weight: bold; display: block; margin-top: 5px;">FPS: --</span>
            </div>

            <!-- Hidden File Input for local file loads -->
            <input type="file" id="file-input" accept=".splat" style="display: none;" />
        </div>
    `;let a=document.getElementById(`canvas`),o=document.getElementById(`status-text`),s=document.getElementById(`loading`),c=document.getElementById(`fps-display`),l=document.getElementById(`file-input`);if(!navigator.gpu){alert(`WebGPU is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser with WebGPU enabled.`);return}let u=await navigator.gpu.requestAdapter();if(!u){alert(`No appropriate WebGPU adapter found.`);return}let d=await u.requestDevice();d.lost.then(e=>{console.error(`WebGPU Device Lost: ${e.message} (Reason: ${e.reason})`)}),o.innerText=`Loading Emscripten WASM module...`;let f=document.createElement(`script`);f.src=i(`splat_renderer.js?t=`+Date.now()),document.head.appendChild(f),f.onload=async()=>{try{console.log(`JS: Calling createSplatRenderer...`);let u=window.createSplatRenderer,f=await u({preinitializedWebGPUDevice:d,locateFile:e=>e.endsWith(`.wasm`)?i(e+`?t=`+Date.now()):e});console.log(`JS: Module initialization complete.`,f);let p=new e(f);s.style.display=`none`,window.selectionMode=`orbit`;let m=()=>{let e=p.getSelectionCount();g.updateSelectionCount(e)},h=new t(a,p);new n(a,p,m);let g=new r(document.querySelector(`#app > div`),p,{onSelectionModeChanged:e=>{window.selectionMode=e,a.style.cursor=e===`lasso`?`cell`:`default`},onDeleteSelected:()=>{p.deleteSelected(),m()},onClearSelection:()=>{p.clearSelection(),m()},onLoadFile:()=>{l.click()},onLoadDemo:async()=>{s.style.display=`block`,o.innerText=`Downloading demo scene (room-7k.splat)...`;try{let e=i(`room-7k.splat`),t=await fetch(e);if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let n=t.headers.get(`content-length`),r=n?parseInt(n,10):0;if(r===0||!t.body){let e=await t.arrayBuffer();p.loadSplatData(e)}else{let e=t.body.getReader(),n=0,i=[];for(;;){let{done:t,value:a}=await e.read();if(t)break;i.push(a),n+=a.length;let s=r?Math.round(n/r*100):0;o.innerText=`Downloading room demo: ${(n/(1024*1024)).toFixed(1)}MB (${s}%)`}o.innerText=`Processing splat data in WebAssembly...`;let a=new Uint8Array(n),s=0;for(let e of i)a.set(e,s),s+=e.length;p.loadSplatData(a.buffer)}p.cameraReset(),p.cameraZoom(-.75),p.setGridEnabled(!1),g.setGridEnabled(!1),m(),s.style.display=`none`}catch(e){alert(`Failed to load demo: ${e.message}`),s.style.display=`none`}},onToggleGrid:e=>{p.setGridEnabled(e)}});l.addEventListener(`change`,async()=>{let e=l.files?.[0];if(e){s.style.display=`block`,o.innerText=`Loading ${e.name}...`;try{let t=await e.arrayBuffer();p.loadSplatData(t),t=null,m(),s.style.display=`none`}catch(e){alert(`Failed to load splat file: ${e.message}`),s.style.display=`none`}finally{l.value=``}}});let _=performance.now(),v=0,y=performance.now(),b=()=>{let e=performance.now(),t=(e-_)/1e3;_=e,h.updateContinuous(t);let n=window.devicePixelRatio||1,r=Math.max(100,Math.round(a.clientWidth*n)),i=Math.max(100,Math.round(a.clientHeight*n));(a.width!==r||a.height!==i)&&(a.width=r,a.height=i),p.renderFrame(r,i,n),v++,e-y>=1e3&&(c.innerText=`FPS: ${Math.round(v*1e3/(e-y))}`,v=0,y=e),requestAnimationFrame(b)};requestAnimationFrame(b)}catch(e){console.error(`JS: Initialization failed:`,e),o.innerText=`Error initializing: `+e.message}}}a();