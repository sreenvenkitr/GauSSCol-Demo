(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{Module;targetYaw=.785398;targetPitch=-.174533;targetDistance=12;targetTarget=[0,0,0];yaw=.785398;pitch=-.174533;distance=12;target=[0,0,0];damping=.12;constructor(e){this.Module=e}loadSplatData(e){console.log(`WasmBridge: loadSplatData started, size:`,e.byteLength);let t=e.byteLength;console.log(`WasmBridge: allocating`,t,`bytes on WASM heap...`);let n=this.Module._malloc(t);console.log(`WasmBridge: allocated ptr:`,n);let r=new Uint8Array(e);console.log(`WasmBridge: copying data to heap...`),this.Module.HEAPU8.set(r,n),console.log(`WasmBridge: calling _loadSplatData in WASM...`),this.Module._loadSplatData(n,t),console.log(`WasmBridge: _loadSplatData returned. Freeing ptr...`),this.Module._free(n),console.log(`WasmBridge: loadSplatData complete.`)}renderFrame(e,t,n){this.Module._renderFrame(e,t,n)}updateCamera(){let e=this.damping;this.yaw+=(this.targetYaw-this.yaw)*e,this.pitch+=(this.targetPitch-this.pitch)*e,this.distance+=(this.targetDistance-this.distance)*e;for(let t=0;t<3;++t)this.target[t]+=(this.targetTarget[t]-this.target[t])*e}cameraOrbit(e,t){this.targetYaw+=e,this.targetPitch=Math.max(-1.553343,Math.min(1.553343,this.targetPitch+t)),this.Module._cameraOrbit(e,t)}cameraZoom(e){this.targetDistance=Math.max(1,Math.min(50,this.targetDistance*(1+e))),this.Module._cameraZoom(e)}cameraPan(e,t){let n=.005*this.targetDistance,r=Math.cos(this.targetYaw),i=-Math.sin(this.targetYaw);this.targetTarget[0]-=r*e*n,this.targetTarget[2]-=i*e*n,this.targetTarget[1]-=t*n,this.Module._cameraPan(e,t)}cameraReset(){this.targetYaw=.785398,this.targetPitch=-.174533,this.targetDistance=12,this.targetTarget=[0,0,0],this.Module._cameraReset()}clearSelection(){this.Module._clearSelection()}getSplatCount(){return this.Module._getSplatCount?this.Module._getSplatCount():16214}getSelectionCount(){return this.Module._getSelectionCount()}getSelectedIndices(){let e=this.getSelectionCount();if(e===0)return[];let t=this.Module._getSelectedIndices||this.Module.getSelectedIndices;if(typeof t==`function`){let n=e*4,r=this.Module._malloc(n);t(r);let i=new Uint32Array(this.Module.HEAPU8.buffer,r,e),a=Array.from(i);return this.Module._free(r),a}throw Error(`FATAL: [WASM][GET_SELECTED_INDICES] Canonical selection API unavailable. Refusing to use TypeScript fallback.`)}splatBuffer=null;originalSplatBuffer=null;canvasWidth=1920;canvasHeight=1080;lassoPoints=[];lassoBegin(){this.lassoPoints=[],this.Module._lassoBegin()}lassoAddPoint(e,t){this.lassoPoints.push({x:e,y:t}),this.Module._lassoAddPoint(e,t)}lassoCommit(e,t){this.Module._lassoCommit(+!!e,+!!t)}lassoDepthRatio=0;setLassoDepthRatio(e){this.lassoDepthRatio=e,this.Module._setLassoDepthRatio&&this.Module._setLassoDepthRatio(e)}setSplatBuffer(e){this.splatBuffer=e,this.originalSplatBuffer=e.slice(0)}computePatchCentroid(e){if(!this.splatBuffer||e.length===0)return[0,0,0];let t=new Float32Array(this.splatBuffer),n=0,r=0,i=0,a=0,o=Math.floor(this.splatBuffer.byteLength/32)-1;for(let s of e)s>=0&&s<=o&&(n+=t[s*8+0],r+=t[s*8+1],i+=t[s*8+2],a++);return a>0?[n/a,r/a,i/a]:[0,0,0]}setDiagnosticColors(e,t){if(!this.originalSplatBuffer)return;let n=this.originalSplatBuffer.slice(0),r=new DataView(n),i=Math.floor(n.byteLength/32)-1,a=(e,t,n,a,o)=>{for(let s of e)if(s>=0&&s<=i){let e=s*32+24;r.setUint8(e+0,t),r.setUint8(e+1,n),r.setUint8(e+2,a),r.setUint8(e+3,o)}};for(let t of e)a(t,0,100,255,255);for(let e of t)a(e,255,30,30,255);this.loadSplatData(n)}clearDiagnosticColors(){this.originalSplatBuffer&&this.loadSplatData(this.originalSplatBuffer)}setCanvasSize(e,t){this.canvasWidth=e,this.canvasHeight=t}setSelectedIndices(e){let t=e.length;if(console.log(`[WASM][SET_SELECTED_INDICES] BEGIN`,{count:t,first:e.slice(0,10),exportType:typeof this.Module._setSelectedIndices}),t===0){this.clearSelection();return}let n=t*4,r=this.Module._malloc(n),i=this.Module.HEAPU32||new Uint32Array(this.Module.HEAPU8.buffer),a=r>>>2;for(let n=0;n<t;n++)i[a+n]=e[n]>>>0;let o=this.Module._setSelectedIndices||this.Module.setSelectedIndices;if(!o&&this.Module.asm&&this.Module.asm._setSelectedIndices&&(o=this.Module.asm._setSelectedIndices),typeof o==`function`){console.log(`[WASM][SET_SELECTED_INDICES] Invoking direct C++ export setSelectedIndices...`),o(r,t),this.Module._free(r),console.log(`[WASM][SET_SELECTED_INDICES] Direct C++ selection complete. Count:`,this.getSelectionCount());return}if(this.Module._free(r),console.warn(`[WASM][SET_SELECTED_INDICES] Direct C++ export missing — executing WASM Lasso bridge fallback.`),!this.splatBuffer){console.warn(`[WASM][SET_SELECTED_INDICES] No splat buffer set for screen projection.`);return}let s=new Float32Array(this.splatBuffer),c=Math.floor(this.splatBuffer.byteLength/32),l=this.computeVPMatrix(),u=[];for(let t=0;t<e.length;++t){let n=e[t];if(n>=c)continue;let r=s[n*8+0],i=s[n*8+1],a=s[n*8+2],o=this.project3DTo2D(r,i,a,l);o&&u.push(o)}if(u.length===0){console.warn(`[WASM][SET_SELECTED_INDICES] Could not project selected 3D splats to screen.`);return}let d=this.getConvexHull(u);if(d.length<3){let e=1/0,t=1/0,n=-1/0,r=-1/0;for(let i of u)e=Math.min(e,i.x),n=Math.max(n,i.x),t=Math.min(t,i.y),r=Math.max(r,i.y);d=[{x:e-10,y:t-10},{x:n+10,y:t-10},{x:n+10,y:r+10},{x:e-10,y:r+10}]}else{let e=0,t=0;for(let n of d)e+=n.x,t+=n.y;e/=d.length,t/=d.length;let n=1.08;d=d.map(r=>({x:e+(r.x-e)*n,y:t+(r.y-t)*n}))}this.lassoBegin();for(let e of d)this.lassoAddPoint(e.x,e.y);this.lassoCommit(!1,!1),console.log(`[WASM][SET_SELECTED_INDICES] WASM Lasso bridge fallback complete. Highlighted ${this.getSelectionCount()} splats in Cyan.`)}computeVPMatrix(){let e=this.yaw,t=this.pitch,n=this.distance,r=this.target,i=Math.cos(t),a=Math.sin(t),o=Math.cos(e),s=Math.sin(e),c=[r[0]+n*i*s,r[1]+n*a,r[2]+n*i*o],l=[0,-1,0],u=r[0]-c[0],d=r[1]-c[1],f=r[2]-c[2],p=Math.sqrt(u*u+d*d+f*f)||1e-8;u/=p,d/=p,f/=p;let m=d*l[2]-f*l[1],h=f*l[0]-u*l[2],g=u*l[1]-d*l[0],_=Math.sqrt(m*m+h*h+g*g)||1e-8;m/=_,h/=_,g/=_;let v=h*f-g*d,y=g*u-m*f,b=m*d-h*u,x=new Float32Array(16);x[0]=m,x[1]=v,x[2]=-u,x[3]=0,x[4]=h,x[5]=y,x[6]=-d,x[7]=0,x[8]=g,x[9]=b,x[10]=-f,x[11]=0,x[12]=-(m*c[0]+h*c[1]+g*c[2]),x[13]=-(v*c[0]+y*c[1]+b*c[2]),x[14]=u*c[0]+d*c[1]+f*c[2],x[15]=1;let S=this.canvasWidth/Math.max(1,this.canvasHeight),C=.1,w=1/Math.tan(1.0471975*.5),T=1/(C-100),E=new Float32Array(16);E[0]=w/S,E[5]=w,E[10]=100.1*T,E[11]=-1,E[14]=200*C*T;let D=new Float32Array(16);for(let e=0;e<4;++e)for(let t=0;t<4;++t){let n=0;for(let r=0;r<4;++r)n+=E[r*4+t]*x[e*4+r];D[e*4+t]=n}return D}project3DTo2D(e,t,n,r){let i=r[0]*e+r[4]*t+r[8]*n+r[12],a=r[1]*e+r[5]*t+r[9]*n+r[13],o=r[3]*e+r[7]*t+r[11]*n+r[15];if(o<=.01)return null;let s=i/o,c=a/o;return{x:(s*.5+.5)*this.canvasWidth,y:(.5-c*.5)*this.canvasHeight}}getConvexHull(e){if(e.length<=3)return e.slice();let t=e.slice().sort((e,t)=>e.x===t.x?e.y-t.y:e.x-t.x),n=(e,t,n)=>(t.x-e.x)*(n.y-e.y)-(t.y-e.y)*(n.x-e.x),r=[];for(let e of t){for(;r.length>=2&&n(r[r.length-2],r[r.length-1],e)<=0;)r.pop();r.push(e)}let i=[];for(let e=t.length-1;e>=0;e--){let r=t[e];for(;i.length>=2&&n(i[i.length-2],i[i.length-1],r)<=0;)i.pop();i.push(r)}return i.pop(),r.pop(),r.concat(i)}deleteSelected(){this.Module._deleteSelected()}setGridEnabled(e){this.Module._setGridEnabled(+!!e)}getModule(){return this.Module}},t=class{canvas;wasm;isDragging=!1;startX=0;startY=0;isPanning=!1;activeControls={rotateUp:!1,rotateDown:!1,rotateLeft:!1,rotateRight:!1,zoomIn:!1,zoomOut:!1};constructor(e,t){this.canvas=e,this.wasm=t,this.setupPointerEvents(),this.setupKeyboardEvents()}setupPointerEvents(){this.canvas.addEventListener(`contextmenu`,e=>e.preventDefault()),this.canvas.addEventListener(`mousedown`,e=>{window.selectionMode===`lasso`||window.selectionMode===`brush`||(e.button===0?(this.isDragging=!0,this.startX=e.clientX,this.startY=e.clientY,this.isPanning=e.shiftKey):e.button===2&&(this.isDragging=!0,this.startX=e.clientX,this.startY=e.clientY,this.isPanning=!0))}),window.addEventListener(`mousemove`,e=>{if(!this.isDragging)return;let t=e.clientX-this.startX,n=e.clientY-this.startY;this.startX=e.clientX,this.startY=e.clientY,this.isPanning?this.wasm.cameraPan(t,n):this.wasm.cameraOrbit(t*.005,-n*.005)}),window.addEventListener(`mouseup`,()=>{this.isDragging=!1}),this.canvas.addEventListener(`wheel`,e=>{this.wasm.cameraZoom(e.deltaY*.001)})}setupKeyboardEvents(){window.addEventListener(`keydown`,e=>{let t=e.key.toLowerCase();[`arrowup`,`arrowdown`,`arrowleft`,`arrowright`,`w`,`s`,`a`,`d`,`q`,`e`].includes(t)&&e.preventDefault(),(t===`arrowup`||t===`w`)&&(this.activeControls.rotateUp=!0),(t===`arrowdown`||t===`s`)&&(this.activeControls.rotateDown=!0),(t===`arrowleft`||t===`a`)&&(this.activeControls.rotateLeft=!0),(t===`arrowright`||t===`d`)&&(this.activeControls.rotateRight=!0),(t===`e`||e.key===`+`||e.key===`=`)&&(this.activeControls.zoomIn=!0),(t===`q`||e.key===`-`)&&(this.activeControls.zoomOut=!0),t===`r`&&this.wasm.cameraReset()}),window.addEventListener(`keyup`,e=>{let t=e.key.toLowerCase();(t===`arrowup`||t===`w`)&&(this.activeControls.rotateUp=!1),(t===`arrowdown`||t===`s`)&&(this.activeControls.rotateDown=!1),(t===`arrowleft`||t===`a`)&&(this.activeControls.rotateLeft=!1),(t===`arrowright`||t===`d`)&&(this.activeControls.rotateRight=!1),(t===`e`||e.key===`+`||e.key===`=`)&&(this.activeControls.zoomIn=!1),(t===`q`||e.key===`-`)&&(this.activeControls.zoomOut=!1)})}updateContinuous(e){let t=1.8;this.activeControls.rotateLeft&&this.wasm.cameraOrbit(-1.8*e,0),this.activeControls.rotateRight&&this.wasm.cameraOrbit(t*e,0),this.activeControls.rotateUp&&this.wasm.cameraOrbit(0,-1.8*e),this.activeControls.rotateDown&&this.wasm.cameraOrbit(0,t*e),this.activeControls.zoomIn&&this.wasm.cameraZoom(-2*e),this.activeControls.zoomOut&&this.wasm.cameraZoom(2*e)}},n=class{canvas;wasm;isDrawing=!1;onSelectionChanged;constructor(e,t,n){this.canvas=e,this.wasm=t,this.onSelectionChanged=n,this.setupLassoEvents()}setupLassoEvents(){this.canvas.addEventListener(`mousedown`,e=>{if(window.selectionMode!==`lasso`||e.button!==0)return;this.isDrawing=!0,this.wasm.lassoBegin();let t=this.canvas.getBoundingClientRect(),n=window.devicePixelRatio||1,r=(e.clientX-t.left)*n,i=(e.clientY-t.top)*n;this.wasm.lassoAddPoint(r,i)}),window.addEventListener(`mousemove`,e=>{if(!this.isDrawing||window.selectionMode!==`lasso`)return;let t=this.canvas.getBoundingClientRect(),n=window.devicePixelRatio||1,r=(e.clientX-t.left)*n,i=(e.clientY-t.top)*n;this.wasm.lassoAddPoint(r,i)}),window.addEventListener(`mouseup`,e=>{this.isDrawing&&(this.isDrawing=!1,this.wasm.lassoCommit(e.shiftKey,e.ctrlKey),this.onSelectionChanged())})}},r=class{segmentationEnabled=!0;parent;callbacks;element=null;sectionCollapsed=!1;displayCollapsed=!1;segCollapsed=!1;demoFlashed=!1;selectionCount=0;showGrid=!0;lassoDepthRatio=0;fineTuneMode=`PRETRAINED_ONLY`;constructor(e,t,n){this.parent=e,this.callbacks=n,this.createPanel()}updateSelectionCount(e){this.selectionCount=e,this.render()}setSegmentationEnabled(e){this.segmentationEnabled=e,this.render()}setGridEnabled(e){this.showGrid=e,this.render()}createPanel(){this.element=document.createElement(`div`),this.element.id=`editor-side-panel`,this.element.style.cssText=`
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
                @keyframes pulse-demo {
                    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                }
                .demo-flash {
                    animation: pulse-demo 1.5s infinite;
                }
            </style>

            <!-- Panel Title / Header -->
            <div style="padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">🌌</span>
                <span style="font-weight: 700; font-size: 15px; letter-spacing: 0.5px; background: linear-gradient(135deg, #a5b4fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">GauSSCol Editor</span>
            </div>

            <!-- File Loading Button -->
            <div style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 8px;">
                <button class="panel-btn" id="btn-load-file" style="width: 100%; background: #818cf8; border-color: rgba(129, 140, 248, 0.4);">📁 Load .ply/.splat File</button>
                <button class="panel-btn ${this.demoFlashed?``:`demo-flash`}" id="btn-load-demo" style="width: 100%; background: rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.2); color: #a5b4fc;">📦 Load Demo Room (36MB)</button>
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

                <!-- Lasso Selection Depth Slider -->
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 10px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-size: 11px; color: rgba(255, 255, 255, 0.75);">Lasso Depth:</span>
                        <span id="lasso-depth-val" style="font-size: 11px; font-weight: 700; color: #818cf8;">${this.lassoDepthRatio===0?`Surface`:this.lassoDepthRatio===1?`Full Depth`:Math.round(this.lassoDepthRatio*100)+`%`}</span>
                    </div>
                    <input type="range" id="slider-lasso-depth" min="0" max="1" step="0.05" value="${this.lassoDepthRatio}" style="width: 100%; cursor: pointer;" />
                </div>

                <!-- Selected Badge & Clear / Delete -->
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 10px; margin-bottom: 0;">
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

            <!-- SECTION: AI Segmentation -->
            <div class="panel-section-header" id="header-seg-sec">
                <span class="panel-section-title">🧠 AI Segmentation</span>
                <span style="font-size: 10px; color: rgba(255,255,255,0.4);">${this.segCollapsed?`▼`:`▲`}</span>
            </div>
            <div class="panel-section-content" id="content-seg-sec" style="display: ${this.segCollapsed?`none`:`block`};">
                <div style="display: flex; gap: 6px; margin-bottom: 16px;">
                    <button class="panel-btn" id="btn-add-pos" style="flex: 1; background: rgba(34, 197, 94, 0.2); border-color: #22c55e; color: #4ade80;" ${this.segmentationEnabled?``:`disabled`}>+ Positive</button>
                    <button class="panel-btn" id="btn-add-neg" style="flex: 1; background: rgba(239, 68, 68, 0.2); border-color: #ef4444; color: #f87171;" ${this.segmentationEnabled?``:`disabled`}>- Negative</button>
                </div>

                <!-- Fine Tune Mode Dropdown -->
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 10px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-size: 11px; color: rgba(255, 255, 255, 0.75);">Fine-Tune Mode:</span>
                    </div>
                    <select id="select-fine-tune-mode" ${this.segmentationEnabled?``:`disabled`} style="width: 100%; padding: 6px; border-radius: 4px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); font-size: 11px; cursor: pointer; outline: none;">
                        <option style="background: #1e1e1e;" value="PRETRAINED_ONLY" ${this.fineTuneMode===`PRETRAINED_ONLY`?`selected`:``}>Exp 1: PRETRAINED_ONLY</option>
                        <option style="background: #1e1e1e;" value="POSITIVE_ONLY_FINETUNE" ${this.fineTuneMode===`POSITIVE_ONLY_FINETUNE`?`selected`:``}>Exp 2: POSITIVE_ONLY_FINETUNE</option>
                        <option style="background: #1e1e1e;" value="POSITIVE_NEGATIVE_FINETUNE" ${this.fineTuneMode===`POSITIVE_NEGATIVE_FINETUNE`?`selected`:``}>Exp 3: POSITIVE_NEGATIVE_FINETUNE</option>
                    </select>
                </div>
                
                ${this.segmentationEnabled?``:`<div style="color: #fca5a5; font-size: 11px; margin-bottom: 8px; text-align: center;">Warning: Segmentation server not running</div>`}

                <!-- Run Phase 2 Segment Button -->
                <button class="panel-btn" id="btn-segment" style="width: 100%; background: linear-gradient(135deg, #10b981, #059669); border-color: #10b981; font-size: 13px; font-weight: 700; padding: 10px 0; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);" ${this.segmentationEnabled?``:`disabled`}>✨ Segment Region</button>
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
        `,this.bindEvents()}bindEvents(){this.element&&(this.element.querySelector(`#header-sec`)?.addEventListener(`click`,()=>{this.sectionCollapsed=!this.sectionCollapsed,this.render()}),this.element.querySelector(`#header-seg-sec`)?.addEventListener(`click`,()=>{this.segCollapsed=!this.segCollapsed,this.render()}),this.element.querySelector(`#header-display-sec`)?.addEventListener(`click`,()=>{this.displayCollapsed=!this.displayCollapsed,this.render()}),this.element.querySelector(`#mode-orbit`)?.addEventListener(`click`,()=>{this.callbacks.onSelectionModeChanged(`orbit`),this.render()}),this.element.querySelector(`#mode-lasso`)?.addEventListener(`click`,()=>{this.callbacks.onSelectionModeChanged(`lasso`),this.render()}),this.element.querySelector(`#slider-lasso-depth`)?.addEventListener(`input`,e=>{let t=e.target;this.lassoDepthRatio=parseFloat(t.value);let n=this.element?.querySelector(`#lasso-depth-val`);n&&(n.textContent=this.lassoDepthRatio===0?`Surface`:this.lassoDepthRatio===1?`Full Depth`:Math.round(this.lassoDepthRatio*100)+`%`),this.callbacks.onLassoDepthChanged&&this.callbacks.onLassoDepthChanged(this.lassoDepthRatio)}),this.element.querySelector(`#btn-deselect`)?.addEventListener(`click`,()=>{this.callbacks.onClearSelection()}),this.element.querySelector(`#btn-delete`)?.addEventListener(`click`,()=>{confirm(`Are you sure you want to delete the selected splats?`)&&this.callbacks.onDeleteSelected()}),this.element.querySelector(`#btn-add-pos`)?.addEventListener(`click`,()=>{this.callbacks.onAddPositivePatch&&this.callbacks.onAddPositivePatch()}),this.element.querySelector(`#btn-add-neg`)?.addEventListener(`click`,()=>{this.callbacks.onAddNegativePatch&&this.callbacks.onAddNegativePatch()}),this.element.querySelector(`#select-fine-tune-mode`)?.addEventListener(`change`,e=>{let t=e.target;this.fineTuneMode=t.value,this.callbacks.onFineTuneModeChanged&&this.callbacks.onFineTuneModeChanged(this.fineTuneMode)}),this.element.querySelector(`#btn-segment`)?.addEventListener(`click`,()=>{this.callbacks.onSegment&&this.callbacks.onSegment()}),this.element.querySelector(`#btn-load-file`)?.addEventListener(`click`,()=>{this.callbacks.onLoadFile()}),this.element.querySelector(`#btn-load-demo`)?.addEventListener(`click`,()=>{this.demoFlashed||(this.demoFlashed=!0,this.render()),this.callbacks.onLoadDemo()}),this.element.querySelector(`#toggle-grid`)?.addEventListener(`change`,e=>{let t=e.target;this.showGrid=t.checked,this.callbacks.onToggleGrid(this.showGrid)}))}},i=`modulepreload`,a=function(e,t){return new URL(e,t).href},o={},s=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=l(t.map(t=>{if(t=a(t,n),t in o)return;o[t]=!0;let r=t.endsWith(`.css`),s=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${s}`))return;let l=document.createElement(`link`);if(l.rel=r?`stylesheet`:i,r||(l.as=`script`),l.crossOrigin=``,l.href=t,c&&l.setAttribute(`nonce`,c),document.head.appendChild(l),r)return new Promise((e,n)=>{l.addEventListener(`load`,e),l.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&s(e.reason);return e().catch(s)})},c=e=>`./`+(e.startsWith(`/`)?e.substring(1):e);async function l(){document.querySelector(`#app`).innerHTML=`
        <div style="position: relative; width: 100vw; height: 100vh; background: #000; overflow: hidden; user-select: none;">
            <canvas id="canvas" style="width: 100%; height: 100%; display: block;"></canvas>
            
            <!-- Loading Indicator Overlay -->
            <div id="loading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; background: rgba(0,0,0,0.85); padding: 25px; border-radius: 12px; font-family: 'Outfit', sans-serif; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); z-index: 200;">
                <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px; color: #818cf8;">GauSSCol</div>
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
            <input type="file" id="file-input" accept=".splat,.ply" style="display: none;" />
        </div>
    `;let i=document.getElementById(`canvas`),a=document.getElementById(`status-text`),o=document.getElementById(`loading`),l=document.getElementById(`fps-display`),u=document.getElementById(`file-input`);if(!navigator.gpu){alert(`WebGPU is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser with WebGPU enabled.`);return}let d=await navigator.gpu.requestAdapter();if(!d){alert(`No appropriate WebGPU adapter found.`);return}let f=await d.requestDevice();f.lost.then(e=>{console.error(`WebGPU Device Lost: ${e.message} (Reason: ${e.reason})`)}),a.innerText=`Loading Emscripten WASM module...`;let p=document.createElement(`script`);p.src=c(`splat_renderer.js?t=`+Date.now()),document.head.appendChild(p),p.onload=async()=>{try{console.log(`JS: Calling createSplatRenderer...`);let d=window.createSplatRenderer,p=await d({preinitializedWebGPUDevice:f,locateFile:e=>e.endsWith(`.wasm`)?c(e+`?t=`+Date.now()):e});console.log(`JS: Module initialization complete.`,p),console.log(`JS: Module exported underscore keys:`,Object.keys(p).filter(e=>e.startsWith(`_`)));let m=new e(p);o.style.display=`none`,window.selectionMode=`orbit`;let h=()=>{let e=m.getSelectionCount();_.updateSelectionCount(e)},g=new t(i,m);new n(i,m,h);let _=new r(document.querySelector(`#app > div`),m,{onSelectionModeChanged:e=>{window.selectionMode=e,i.style.cursor=e===`lasso`?`cell`:`default`},onFineTuneModeChanged:e=>{S=e,console.log(`[UI] Fine-Tune Mode changed to: ${e}`)},onLassoDepthChanged:e=>{m.setLassoDepthRatio(e)},onDeleteSelected:()=>{m.deleteSelected(),h()},onClearSelection:()=>{m.clearSelection(),h()},onLoadFile:()=>{u.click()},onLoadDemo:async()=>{o.style.display=`block`,a.innerText=`Downloading demo scene (room-7k.splat)...`;try{let e=c(`room-7k.splat`),t=await fetch(e);if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let n=t.headers.get(`content-length`),r=n?parseInt(n,10):0;if(r===0||!t.body){let e=await t.arrayBuffer();m.loadSplatData(e)}else{let e=t.body.getReader(),n=0,i=[];for(;;){let{done:t,value:o}=await e.read();if(t)break;i.push(o),n+=o.length;let s=r?Math.round(n/r*100):0;a.innerText=`Downloading room demo: ${(n/(1024*1024)).toFixed(1)}MB (${s}%)`}a.innerText=`Processing splat data in WebAssembly...`;let o=new Uint8Array(n),s=0;for(let e of i)o.set(e,s),s+=e.length;m.loadSplatData(o.buffer)}m.cameraReset(),m.cameraZoom(-.75),m.setGridEnabled(!1),_.setGridEnabled(!1),b=`C:\\Projects\\Segmentation\\GauSSCol\\GauSSCol\\frontend\\public\\room-7k.splat`,h(),o.style.display=`none`}catch(e){alert(`Failed to load demo: ${e.message}`),o.style.display=`none`}},onToggleGrid:e=>{m.setGridEnabled(e)},onAddPositivePatch:()=>{if(m.getSelectionCount()===0){alert(`No splats currently selected. Please draw a Lasso selection first.`);return}let e=m.getSelectedIndices();if(e.length===0){alert(`Fallback lasso failed to intersect any splats. Please draw a slightly larger lasso.`);return}v.push(e),console.log(`[SEGMENT][SEED_ADDED] Added positive patch #${v.length}: count=${e.length}`),alert(`Added positive seed patch #${v.length} (${e.length} splats).`),m.clearSelection(),h()},onAddNegativePatch:()=>{if(m.getSelectionCount()===0){alert(`No splats currently selected. Please draw a Lasso selection first.`);return}let e=m.getSelectedIndices();if(e.length===0){alert(`Fallback lasso failed to intersect any splats. Please draw a slightly larger lasso.`);return}y.push(e),console.log(`[SEGMENT][SEED_ADDED] Added negative patch #${y.length}: count=${e.length}`),alert(`Added negative seed patch #${y.length} (${e.length} splats).`),m.clearSelection(),h()},onSegment:async()=>{let e=m.getSelectionCount(),t=[...v];if(e>0){let n=m.getSelectedIndices();n.length===e&&t.push(n)}if(t.length===0){alert(`Please select at least one positive seed patch using Lasso before segmenting.`);return}let n=crypto.randomUUID();o.style.display=`block`,a.innerText=`Fine-tuning GEC embeddings and segmenting region...`;try{let{SegmentationClient:e}=await s(async()=>{let{SegmentationClient:e}=await import(`./SegmentationClient-NOvolFhf.js`);return{SegmentationClient:e}},[],import.meta.url),r=await new e(`http://localhost:8000`).segment(t,y,n,x,S);o.style.display=`none`,v=[],y=[];let i=r.index_space||r.selected_id_space||`processed`;if(i!==`processed`)throw Error(`Invalid ID space returned by server: ${i}. Expected 'processed'.`);if(r.selected_ids&&Array.isArray(r.selected_ids)){m.setSelectedIndices(r.selected_ids),h();let e=m.getSelectionCount();alert(`Segmentation complete! ${e} Gaussians highlighted in Cyan.`)}}catch(e){alert(`Segmentation failed: ${e.message}. Make sure FastAPI server (run_server.py) is running.`),o.style.display=`none`}}}),v=[],y=[],b=``,x=``,S=`PRETRAINED_ONLY`;(async()=>{try{let{SegmentationClient:e}=await s(async()=>{let{SegmentationClient:e}=await import(`./SegmentationClient-NOvolFhf.js`);return{SegmentationClient:e}},[],import.meta.url),t=await new e(`http://localhost:8000`).getStatus();_.setSegmentationEnabled(t.status!==`unavailable`)}catch{_.setSegmentationEnabled(!1)}})(),u.addEventListener(`change`,async()=>{let e=u.files?.[0];if(e){o.style.display=`block`,a.innerText=`Checking backend server availability for ${e.name}...`,b=`C:\\Projects\\Segmentation\\PretrainDataset\\${e.name}`,v=[],y=[];try{let{SegmentationClient:t}=await s(async()=>{let{SegmentationClient:e}=await import(`./SegmentationClient-NOvolFhf.js`);return{SegmentationClient:e}},[],import.meta.url),n=new t(`http://localhost:8000`),r=null,c=!1;try{(await n.getStatus()).status!==`unavailable`&&(c=!0)}catch{c=!1}if(c){_.setSegmentationEnabled(!0),console.log(`[BACKEND][STATUS] Backend available — requesting canonical processed scene load...`),a.innerText=`Backend loading and preprocessing ${e.name}...`;let t=await n.loadScene(b);console.log(`[SCENE][PREPROCESS] Backend preprocessing complete. Source=${t.source_count}, Processed=${t.processed_count}`),a.innerText=`Fetching canonical processed splat buffer from backend (${t.processed_count} splats)...`;let o=await n.getProcessedSplats(t.scene_id);r=o.buffer,x=o.hash||``,r&&(m.loadSplatData(r),m.setSplatBuffer(r),m.setCanvasSize(i.clientWidth||1920,i.clientHeight||1080));let s=m.getSplatCount?m.getSplatCount():t.processed_count;console.log(`============================================================`),console.log(`[SCENE][SYNC_CHECK] Canonical Backend Processed Scene: ${b}`),console.log(`  Backend Source PLY Count = ${t.source_count}`),console.log(`  Backend Processed Count   = ${t.processed_count}`),console.log(`  Browser Loaded Splats     = ${s}`),console.log(`  Index Space               = processed (1-to-1 node match)`),console.log(`  COUNT_MATCH               = ${t.processed_count===s}`),console.log(`============================================================`)}else _.setSegmentationEnabled(!1),console.warn(`[BACKEND][STATUS] Backend unavailable — falling back to local raw PLY loading!`),console.warn(`[SEGMENTATION][STATUS] Segmentation DISABLED — backend unavailable.`),a.innerText=`Loading local PLY file ${e.name}...`,r=await e.arrayBuffer(),r&&(m.loadSplatData(r),m.setSplatBuffer(r),m.setCanvasSize(i.clientWidth||1920,i.clientHeight||1080));m.clearSelection(),h(),o.style.display=`none`}catch(e){alert(`Failed to load file: ${e.message}`),o.style.display=`none`}finally{u.value=``}}});let C=performance.now(),w=0,T=performance.now(),E=()=>{let e=performance.now(),t=(e-C)/1e3;C=e,g.updateContinuous(t);let n=window.devicePixelRatio||1,r=Math.max(100,Math.round(i.clientWidth*n)),a=Math.max(100,Math.round(i.clientHeight*n));(i.width!==r||i.height!==a)&&(i.width=r,i.height=a),m.updateCamera(),m.renderFrame(r,a,n),w++,e-T>=1e3&&(l.innerText=`FPS: ${Math.round(w*1e3/(e-T))}`,w=0,T=e),requestAnimationFrame(E)};requestAnimationFrame(E)}catch(e){console.error(`JS: Initialization failed:`,e),a.innerText=`Error initializing: `+e.message}}}l();