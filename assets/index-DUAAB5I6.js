(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{Module;targetYaw=.785398;targetPitch=-.174533;targetDistance=12;targetTarget=[0,0,0];yaw=.785398;pitch=-.174533;distance=12;target=[0,0,0];damping=.12;camStatePtr=0;constructor(e){this.Module=e,this.Module&&this.Module._malloc&&(this.camStatePtr=this.Module._malloc(24))}loadSplatData(e){console.log(`WasmBridge: loadSplatData started, size:`,e.byteLength);let t=e.byteLength;console.log(`WasmBridge: allocating`,t,`bytes on WASM heap...`);let n=this.Module._malloc(t);console.log(`WasmBridge: allocated ptr:`,n);let r=new Uint8Array(e);console.log(`WasmBridge: copying data to heap...`),this.Module.HEAPU8.set(r,n),console.log(`WasmBridge: calling _loadSplatData in WASM...`),this.Module._loadSplatData(n,t),console.log(`WasmBridge: _loadSplatData returned. Freeing ptr...`),this.Module._free(n),console.log(`WasmBridge: loadSplatData complete.`)}getSplatBuffer(){if(!this.Module._getSplatBufferPtr||!this.Module._getSplatBufferSize)return null;let e=this.Module._getSplatBufferSize();if(e===0)return null;let t=this.Module._getSplatBufferPtr();return t?this.Module.HEAPU8.slice(t,t+e).buffer:null}loadMeshData(e,t){console.log(`WasmBridge: loadMeshData started, size:`,e.byteLength,`hint:`,t);let n=e.byteLength,r=this.Module._malloc(n),i=new Uint8Array(e);this.Module.HEAPU8.set(i,r);let a=0;if(t&&this.Module.stringToUTF8){let e=this.Module.lengthBytesUTF8?this.Module.lengthBytesUTF8(t)+1:t.length+1;a=this.Module._malloc(e),this.Module.stringToUTF8(t,a,e)}let o=this.Module._loadMeshData(r,n,a)!==0;if(a&&this.Module._free(a),this.Module._free(r),o){let e=this.getMeshBounds(),t=.5*(e[0]+e[3]),n=.5*(e[1]+e[4]),r=.5*(e[2]+e[5]),i=e[3]-e[0],a=e[4]-e[1],o=e[5]-e[2],s=.5*Math.sqrt(i*i+a*a+o*o);s<1e-4&&(s=1);let c=Math.max(.2,Math.min(1e3,s/Math.sin(1.0471975*.5)*1.35));this.targetTarget=[t,n,r],this.target=[t,n,r],this.targetDistance=c,this.distance=c,this.targetYaw=.785398,this.yaw=.785398,this.targetPitch=.35,this.pitch=.35}return console.log(`WasmBridge: loadMeshData complete. Success:`,o),o}getSceneType(){if(!this.Module._getSceneType)return`gaussian`;let e=this.Module._getSceneType();return e===1?`gaussian`:e===2?`mesh`:`none`}getMeshInfo(){if(!this.Module._getMeshInfo)return{vertexCount:0,triangleCount:0,materialCount:0,textureCount:0};let e=this.Module._malloc(16);this.Module._getMeshInfo(e);let t=new Uint32Array(this.Module.HEAPU8.buffer,e,4),n={vertexCount:t[0],triangleCount:t[1],materialCount:t[2],textureCount:t[3]};return this.Module._free(e),n}getMeshBounds(){if(!this.Module._getMeshBounds)return[0,0,0,0,0,0];let e=this.Module._malloc(24);this.Module._getMeshBounds(e);let t=new Float32Array(this.Module.HEAPU8.buffer,e,6),n=[t[0],t[1],t[2],t[3],t[4],t[5]];return this.Module._free(e),n}renderFrame(e,t,n){this.Module._renderFrame(e,t,n)}updateCamera(){let e=this.damping;this.yaw+=(this.targetYaw-this.yaw)*e,this.pitch+=(this.targetPitch-this.pitch)*e,this.distance+=(this.targetDistance-this.distance)*e;for(let t=0;t<3;++t)this.target[t]+=(this.targetTarget[t]-this.target[t])*e}cameraOrbit(e,t){this.targetYaw+=e,this.targetPitch=Math.max(-1.553343,Math.min(1.553343,this.targetPitch+t)),this.Module._cameraOrbit(e,t)}cameraZoom(e){this.targetDistance=Math.max(1,Math.min(50,this.targetDistance*(1+e))),this.Module._cameraZoom(e)}cameraPan(e,t){let n=.005*this.targetDistance,r=Math.cos(this.targetYaw),i=-Math.sin(this.targetYaw);this.targetTarget[0]-=r*e*n,this.targetTarget[2]-=i*e*n,this.targetTarget[1]-=t*n,this.Module._cameraPan(e,t)}cameraReset(){this.targetYaw=.785398,this.targetPitch=-.174533,this.targetDistance=12,this.targetTarget=[0,0,0],this.Module._cameraReset()}setCameraDamping(e){this.damping=e,this.Module._setCameraDamping&&this.Module._setCameraDamping(e)}snapCamera(){this.yaw=this.targetYaw,this.pitch=this.targetPitch,this.distance=this.targetDistance,this.target=[...this.targetTarget],this.Module._snapCamera&&this.Module._snapCamera()}setCameraState(e,t,n,r,i,a){this.yaw=e,this.pitch=t,this.distance=n,this.target=[r,i,a],this.targetYaw=e,this.targetPitch=t,this.targetDistance=n,this.targetTarget=[r,i,a],this.Module._setCameraState&&this.Module._setCameraState(e,t,n,r,i,a)}getCameraState(){if(this.Module._getCameraState&&this.camStatePtr){this.Module._getCameraState(this.camStatePtr);let e=this.camStatePtr>>2;this.yaw=this.Module.HEAPF32[e+0],this.pitch=this.Module.HEAPF32[e+1],this.distance=this.Module.HEAPF32[e+2],this.target[0]=this.Module.HEAPF32[e+3],this.target[1]=this.Module.HEAPF32[e+4],this.target[2]=this.Module.HEAPF32[e+5]}return{yaw:this.yaw,pitch:this.pitch,distance:this.distance,target:[...this.target],targetYaw:this.targetYaw,targetPitch:this.targetPitch,targetDistance:this.targetDistance,targetTarget:[...this.targetTarget]}}restoreCameraState(e){this.setCameraState(e.yaw,e.pitch,e.distance,e.target[0],e.target[1],e.target[2])}settleCamera(e,t,n,r=30){for(let i=0;i<r;i++)this.updateCamera(),this.renderFrame(e,t,n)}clearSelection(){this.Module._clearSelection()}getSplatCount(){return this.Module._getSplatCount?this.Module._getSplatCount():16214}getSelectionCount(){return this.Module._getSelectionCount()}getSelectedIndices(){let e=this.getSelectionCount();if(e===0)return[];let t=this.Module._getSelectedIndices||this.Module.getSelectedIndices;if(typeof t==`function`){let n=e*4,r=this.Module._malloc(n);t(r);let i=new Uint32Array(this.Module.HEAPU8.buffer,r,e),a=Array.from(i);return this.Module._free(r),a}throw Error(`FATAL: [WASM][GET_SELECTED_INDICES] Canonical selection API unavailable. Refusing to use TypeScript fallback.`)}hasSamMask(){return this.Module._hasSamMask?this.Module._hasSamMask()===1:!1}clearSamMask(){this.Module._clearSamMask&&this.Module._clearSamMask()}splatBuffer=null;originalSplatBuffer=null;canvasWidth=1920;canvasHeight=1080;lassoPoints=[];lassoBegin(){this.lassoPoints=[],this.Module._lassoBegin()}lassoAddPoint(e,t){this.lassoPoints.push({x:e,y:t}),this.Module._lassoAddPoint(e,t)}lassoCommit(e,t){this.Module._lassoCommit(+!!e,+!!t)}lassoDepthRatio=0;setLassoDepthRatio(e){this.lassoDepthRatio=e,this.Module._setLassoDepthRatio&&this.Module._setLassoDepthRatio(e)}getLassoDepthRatio(){return this.lassoDepthRatio}setSplatBuffer(e){this.splatBuffer=e,this.originalSplatBuffer=e.slice(0)}computePatchCentroid(e){if(!this.splatBuffer||e.length===0)return[0,0,0];let t=new Float32Array(this.splatBuffer),n=0,r=0,i=0,a=0,o=Math.floor(this.splatBuffer.byteLength/32)-1;for(let s of e)s>=0&&s<=o&&(n+=t[s*8+0],r+=t[s*8+1],i+=t[s*8+2],a++);return a>0?[n/a,r/a,i/a]:[0,0,0]}setDiagnosticColors(e,t){if(!this.originalSplatBuffer)return;let n=this.originalSplatBuffer.slice(0),r=new DataView(n),i=Math.floor(n.byteLength/32)-1,a=(e,t,n,a,o)=>{for(let s of e)if(s>=0&&s<=i){let e=s*32+24;r.setUint8(e+0,t),r.setUint8(e+1,n),r.setUint8(e+2,a),r.setUint8(e+3,o)}};for(let t of e)a(t,0,100,255,255);for(let e of t)a(e,255,30,30,255);this.loadSplatData(n)}clearDiagnosticColors(){this.originalSplatBuffer&&this.loadSplatData(this.originalSplatBuffer)}setCanvasSize(e,t){this.canvasWidth=e,this.canvasHeight=t}setSelectedIndices(e){let t=e.length;if(console.log(`[WASM][SET_SELECTED_INDICES] BEGIN`,{count:t,first:e.slice(0,10),exportType:typeof this.Module._setSelectedIndices}),t===0){this.clearSelection();return}let n=t*4,r=this.Module._malloc(n),i=this.Module.HEAPU32||new Uint32Array(this.Module.HEAPU8.buffer),a=r>>>2;for(let n=0;n<t;n++)i[a+n]=e[n]>>>0;let o=this.Module._setSelectedIndices||this.Module.setSelectedIndices;if(!o&&this.Module.asm&&this.Module.asm._setSelectedIndices&&(o=this.Module.asm._setSelectedIndices),typeof o==`function`){console.log(`[WASM][SET_SELECTED_INDICES] Invoking direct C++ export setSelectedIndices...`),o(r,t),this.Module._free(r),console.log(`[WASM][SET_SELECTED_INDICES] Direct C++ selection complete. Count:`,this.getSelectionCount());return}if(this.Module._free(r),console.warn(`[WASM][SET_SELECTED_INDICES] Direct C++ export missing — executing WASM Lasso bridge fallback.`),!this.splatBuffer){console.warn(`[WASM][SET_SELECTED_INDICES] No splat buffer set for screen projection.`);return}let s=new Float32Array(this.splatBuffer),c=Math.floor(this.splatBuffer.byteLength/32),l=this.computeVPMatrix(),u=[];for(let t=0;t<e.length;++t){let n=e[t];if(n>=c)continue;let r=s[n*8+0],i=s[n*8+1],a=s[n*8+2],o=this.project3DTo2D(r,i,a,l);o&&u.push(o)}if(u.length===0){console.warn(`[WASM][SET_SELECTED_INDICES] Could not project selected 3D splats to screen.`);return}let d=this.getConvexHull(u);if(d.length<3){let e=1/0,t=1/0,n=-1/0,r=-1/0;for(let i of u)e=Math.min(e,i.x),n=Math.max(n,i.x),t=Math.min(t,i.y),r=Math.max(r,i.y);d=[{x:e-10,y:t-10},{x:n+10,y:t-10},{x:n+10,y:r+10},{x:e-10,y:r+10}]}else{let e=0,t=0;for(let n of d)e+=n.x,t+=n.y;e/=d.length,t/=d.length;let n=1.08;d=d.map(r=>({x:e+(r.x-e)*n,y:t+(r.y-t)*n}))}this.lassoBegin();for(let e of d)this.lassoAddPoint(e.x,e.y);this.lassoCommit(!1,!1),console.log(`[WASM][SET_SELECTED_INDICES] WASM Lasso bridge fallback complete. Highlighted ${this.getSelectionCount()} splats in Cyan.`)}computeVPMatrix(){let e=this.yaw,t=this.pitch,n=this.distance,r=this.target,i=Math.cos(t),a=Math.sin(t),o=Math.cos(e),s=Math.sin(e),c=[r[0]+n*i*s,r[1]+n*a,r[2]+n*i*o],l=[0,-1,0],u=r[0]-c[0],d=r[1]-c[1],f=r[2]-c[2],p=Math.sqrt(u*u+d*d+f*f)||1e-8;u/=p,d/=p,f/=p;let m=d*l[2]-f*l[1],h=f*l[0]-u*l[2],g=u*l[1]-d*l[0],_=Math.sqrt(m*m+h*h+g*g)||1e-8;m/=_,h/=_,g/=_;let v=h*f-g*d,y=g*u-m*f,b=m*d-h*u,x=new Float32Array(16);x[0]=m,x[1]=v,x[2]=-u,x[3]=0,x[4]=h,x[5]=y,x[6]=-d,x[7]=0,x[8]=g,x[9]=b,x[10]=-f,x[11]=0,x[12]=-(m*c[0]+h*c[1]+g*c[2]),x[13]=-(v*c[0]+y*c[1]+b*c[2]),x[14]=u*c[0]+d*c[1]+f*c[2],x[15]=1;let S=this.canvasWidth/Math.max(1,this.canvasHeight),C=.1,w=1/Math.tan(1.0471975*.5),T=1/(C-100),E=new Float32Array(16);E[0]=w/S,E[5]=w,E[10]=100.1*T,E[11]=-1,E[14]=200*C*T;let D=new Float32Array(16);for(let e=0;e<4;++e)for(let t=0;t<4;++t){let n=0;for(let r=0;r<4;++r)n+=E[r*4+t]*x[e*4+r];D[e*4+t]=n}return D}project3DTo2D(e,t,n,r){let i=r[0]*e+r[4]*t+r[8]*n+r[12],a=r[1]*e+r[5]*t+r[9]*n+r[13],o=r[3]*e+r[7]*t+r[11]*n+r[15];if(o<=.01)return null;let s=i/o,c=a/o;return{x:(s*.5+.5)*this.canvasWidth,y:(.5-c*.5)*this.canvasHeight}}getConvexHull(e){if(e.length<=3)return e.slice();let t=e.slice().sort((e,t)=>e.x===t.x?e.y-t.y:e.x-t.x),n=(e,t,n)=>(t.x-e.x)*(n.y-e.y)-(t.y-e.y)*(n.x-e.x),r=[];for(let e of t){for(;r.length>=2&&n(r[r.length-2],r[r.length-1],e)<=0;)r.pop();r.push(e)}let i=[];for(let e=t.length-1;e>=0;e--){let r=t[e];for(;i.length>=2&&n(i[i.length-2],i[i.length-1],r)<=0;)i.pop();i.push(r)}return i.pop(),r.pop(),r.concat(i)}deleteSelected(){this.Module._deleteSelected()}setGridEnabled(e){this.Module._setGridEnabled(+!!e)}refineSelection(e,t){let n=this.Module._refineSelection||this.Module.refineSelection;if(typeof n!=`function`)throw Error(`FATAL: [WASM][REFINE_SELECTION] Canonical refineSelection API unavailable in WASM.`);let r=e.length,i=0;if(r>0){i=this.Module._malloc(r*4);let t=this.Module.HEAPU32||new Uint32Array(this.Module.HEAPU8.buffer),n=i>>>2;for(let i=0;i<r;i++)t[n+i]=e[i]>>>0}n(i,r,+!!t.enabled,+!!t.useMultiViewConstraint,t.minSelectedNeighborSupport??2,t.topKNeighborSupport??3,t.highConfidenceThreshold??.35,t.mediumConfidenceThreshold??.24,t.singleNeighborHighConfidenceThreshold??.36,t.singleNeighborMinObjectCompat??0,t.neighborK??8,t.radiusMultiplier??4.5,t.weightPosition??.4,t.weightCovariance??.25,t.weightNormal??.1,t.weightScale??.1,t.weightColor??.15,t.weightOrientation??0,t.weightObjectCompat??0,t.maxIterations??25,t.maxNewGaussians??15e4,t.maxGrowthRatio??0,0),i&&this.Module._free(i);let a=this.Module._malloc(64);this.Module._getRefinementCounts(a);let o=new Uint32Array(this.Module.HEAPU8.buffer,a,16),s=o[0],c=o[1],l=o[2],u=o[3],d=o[4],f=o[5],p=o[6],m=o[7],h=o[8],g=o[9],_=o[10],v=o[11],y=o[12];this.Module._free(a);let b=[],x=[];if(u>0||l>0){let e=u>0?this.Module._malloc(u*4):0,t=l>0?this.Module._malloc(l*4):0;if(this.Module._getRefinementIndices(e,t),e){let t=new Uint32Array(this.Module.HEAPU8.buffer,e,u);b=Array.from(t),this.Module._free(e)}if(t){let e=new Uint32Array(this.Module.HEAPU8.buffer,t,l);x=Array.from(e),this.Module._free(t)}}let S=this.Module._malloc(16);this.Module._getRefinementDiagnostics(S);let C=new Float32Array(this.Module.HEAPU8.buffer,S,4),w=C[0],T=C[1],E=C[2];return this.Module._free(S),{selectedIds:b,newlyAddedIds:x,diagnostics:{samSeedCount:s,initialFrontierSize:c,newlyAddedCount:l,finalSelectedCount:u,iterationCount:d,runawayTriggered:f,candidatesEvaluated:p,rejectedByGeometry:m,rejectedByNegativeVeto:h,rejectedByInsufficientSupport:g,uncertainVisibilityOrDepth:_,acceptedMultiView:v,acceptedSingleObservable:y,spatialIndexBuildMs:w,propagationMs:T,totalRefinementMs:E}}}resetSemanticUplifter(){this.Module._resetSemanticUplifter&&this.Module._resetSemanticUplifter()}processMaskView(e,t,n,r,i,a){if(!this.Module._processMaskView)return{totalFgPixels:0,uniqueGaussians:0,filteredPixels:0,filteredDepth:0,candidateCount:0};let o=e.byteLength,s=this.Module._malloc(o);this.Module.HEAPU8.set(e,s);let c=r.byteLength,l=this.Module._malloc(c);this.Module.HEAPU8.set(r,l);let u=this.Module._malloc(20),d=this.Module._processMaskView(s,t,n,l,i,a.yaw,a.pitch,a.distance,a.target[0],a.target[1],a.target[2],a.fovY,u),f={totalFgPixels:0,uniqueGaussians:0,filteredPixels:0,filteredDepth:0,candidateCount:0};if(d&&this.Module.HEAPU32){let e=u>>2;f={totalFgPixels:this.Module.HEAPU32[e+0],uniqueGaussians:this.Module.HEAPU32[e+1],filteredPixels:this.Module.HEAPU32[e+2],filteredDepth:this.Module.HEAPU32[e+3],candidateCount:this.Module.HEAPU32[e+4]}}return this.Module._free(u),this.Module._free(l),this.Module._free(s),f}computeConsensusSeeds(e){if(!this.Module._computeConsensusSeeds)return{candidateSeeds:[],filteredOutliers:0};let t=this.Module._malloc(1e6*4),n=this.Module._malloc(4),r=this.Module._computeConsensusSeeds(e,t,n),i=[],a=0;if(r>0&&this.Module.HEAPU32){let e=t>>2;i=Array.from(this.Module.HEAPU32.subarray(e,e+r)),a=this.Module.HEAPU32[n>>2]}return this.Module._free(n),this.Module._free(t),{candidateSeeds:i,filteredOutliers:a}}setSemanticCoverageMode(e){this.Module._setSemanticCoverageMode&&this.Module._setSemanticCoverageMode(+!!e)}isSemanticCoverageMode(){return this.Module._isSemanticCoverageMode?this.Module._isSemanticCoverageMode()===1:!0}getModule(){return this.Module}},t=class{canvas;wasm;isDragging=!1;startX=0;startY=0;isPanning=!1;activeControls={rotateUp:!1,rotateDown:!1,rotateLeft:!1,rotateRight:!1,zoomIn:!1,zoomOut:!1};constructor(e,t){this.canvas=e,this.wasm=t,this.setupPointerEvents(),this.setupKeyboardEvents()}setupPointerEvents(){this.canvas.addEventListener(`contextmenu`,e=>e.preventDefault()),this.canvas.addEventListener(`mousedown`,e=>{let t=window.selectionMode;this.wasm.getSceneType()!==`mesh`&&t===`lasso`||(e.button===0?(this.isDragging=!0,this.startX=e.clientX,this.startY=e.clientY,this.isPanning=e.shiftKey):e.button===2&&(this.isDragging=!0,this.startX=e.clientX,this.startY=e.clientY,this.isPanning=!0))}),window.addEventListener(`mousemove`,e=>{if(!this.isDragging)return;let t=e.clientX-this.startX,n=e.clientY-this.startY;this.startX=e.clientX,this.startY=e.clientY,this.isPanning?this.wasm.cameraPan(t,n):this.wasm.cameraOrbit(t*.005,-n*.005)}),window.addEventListener(`mouseup`,()=>{this.isDragging=!1}),this.canvas.addEventListener(`wheel`,e=>{this.wasm.cameraZoom(e.deltaY*.001)})}setupKeyboardEvents(){window.addEventListener(`keydown`,e=>{let t=e.target;if(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))return;let n=e.key.toLowerCase();[`arrowup`,`arrowdown`,`arrowleft`,`arrowright`,`w`,`s`,`a`,`d`,`q`,`e`].includes(n)&&e.preventDefault(),(n===`arrowup`||n===`w`)&&(this.activeControls.rotateUp=!0),(n===`arrowdown`||n===`s`)&&(this.activeControls.rotateDown=!0),(n===`arrowleft`||n===`a`)&&(this.activeControls.rotateLeft=!0),(n===`arrowright`||n===`d`)&&(this.activeControls.rotateRight=!0),(n===`e`||e.key===`+`||e.key===`=`)&&(this.activeControls.zoomIn=!0),(n===`q`||e.key===`-`)&&(this.activeControls.zoomOut=!0),n===`r`&&this.wasm.cameraReset()}),window.addEventListener(`keyup`,e=>{let t=e.target;if(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))return;let n=e.key.toLowerCase();(n===`arrowup`||n===`w`)&&(this.activeControls.rotateUp=!1),(n===`arrowdown`||n===`s`)&&(this.activeControls.rotateDown=!1),(n===`arrowleft`||n===`a`)&&(this.activeControls.rotateLeft=!1),(n===`arrowright`||n===`d`)&&(this.activeControls.rotateRight=!1),(n===`e`||e.key===`+`||e.key===`=`)&&(this.activeControls.zoomIn=!1),(n===`q`||e.key===`-`)&&(this.activeControls.zoomOut=!1)})}updateContinuous(e){let t=1.8;this.activeControls.rotateLeft&&this.wasm.cameraOrbit(-1.8*e,0),this.activeControls.rotateRight&&this.wasm.cameraOrbit(t*e,0),this.activeControls.rotateUp&&this.wasm.cameraOrbit(0,-1.8*e),this.activeControls.rotateDown&&this.wasm.cameraOrbit(0,t*e),this.activeControls.zoomIn&&this.wasm.cameraZoom(-2*e),this.activeControls.zoomOut&&this.wasm.cameraZoom(2*e)}},n=class{canvas;wasm;isDrawing=!1;onSelectionChanged;constructor(e,t,n){this.canvas=e,this.wasm=t,this.onSelectionChanged=n,this.setupLassoEvents()}cancel(){this.isDrawing=!1}setupLassoEvents(){this.canvas.addEventListener(`mousedown`,e=>{let t=window.selectionMode;if(this.wasm.getSceneType()===`mesh`||t!==`lasso`||e.button!==0)return;this.isDrawing=!0,this.wasm.lassoBegin();let n=this.canvas.getBoundingClientRect(),r=window.devicePixelRatio||1,i=(e.clientX-n.left)*r,a=(e.clientY-n.top)*r;this.wasm.lassoAddPoint(i,a)}),window.addEventListener(`mousemove`,e=>{let t=window.selectionMode;if(!this.isDrawing||this.wasm.getSceneType()===`mesh`||t!==`lasso`)return;let n=this.canvas.getBoundingClientRect(),r=window.devicePixelRatio||1,i=(e.clientX-n.left)*r,a=(e.clientY-n.top)*r;this.wasm.lassoAddPoint(i,a)}),window.addEventListener(`mouseup`,e=>{if(!this.isDrawing||(this.isDrawing=!1,this.wasm.getSceneType()===`mesh`))return;let t=this.wasm.getSelectionCount()>0,n=e.shiftKey||t&&!e.ctrlKey&&!e.altKey,r=e.ctrlKey;this.wasm.lassoCommit(n,r),this.onSelectionChanged()})}},r={enabled:!0,minSelectedNeighborSupport:2,topKNeighborSupport:3,highConfidenceThreshold:.35,mediumConfidenceThreshold:.24,singleNeighborHighConfidenceThreshold:.36,singleNeighborMinObjectCompat:0,neighborK:8,radiusMultiplier:4.5,weightPosition:.4,weightCovariance:.25,weightNormal:.1,weightScale:.1,weightColor:.15,weightOrientation:0,weightObjectCompat:0,maxIterations:25,maxNewGaussians:15e4,maxGrowthRatio:0,useMultiViewConstraint:!1},i=[{name:`Base Surface Expansion`,config:{radiusMultiplier:4.5,highConfidenceThreshold:.35,mediumConfidenceThreshold:.24,singleNeighborHighConfidenceThreshold:.36,maxIterations:25}},{name:`Curvature & Shadow Bridging`,config:{radiusMultiplier:5.5,highConfidenceThreshold:.26,mediumConfidenceThreshold:.18,singleNeighborHighConfidenceThreshold:.28,maxIterations:25}},{name:`Thin Structures & Joint Bridging`,config:{radiusMultiplier:6.8,highConfidenceThreshold:.2,mediumConfidenceThreshold:.14,singleNeighborHighConfidenceThreshold:.2,maxIterations:30}},{name:`Opposing Faces & Enclosure`,config:{radiusMultiplier:8.5,highConfidenceThreshold:.15,mediumConfidenceThreshold:.1,singleNeighborHighConfidenceThreshold:.15,maxIterations:35}},{name:`Deep Whole-Object Penetration`,config:{radiusMultiplier:10,highConfidenceThreshold:.12,mediumConfidenceThreshold:.08,singleNeighborHighConfidenceThreshold:.12,maxIterations:40}}],a=[{name:`Base Surface Expansion`,config:{radiusMultiplier:4.5,highConfidenceThreshold:.35,mediumConfidenceThreshold:.24,singleNeighborHighConfidenceThreshold:.36,maxIterations:25}},{name:`Conservative Surface Bridging`,config:{radiusMultiplier:5.5,highConfidenceThreshold:.28,mediumConfidenceThreshold:.2,singleNeighborHighConfidenceThreshold:.3,maxIterations:25}}],o=class{parent;callbacks;element=null;isPanelCollapsed=!1;sectionCollapsed=!1;displayCollapsed=!1;demoFlashed=!1;sceneType=`gaussian`;meshInfo=null;selectionCount=0;hasSamMask=!1;showGrid=!0;lassoDepthRatio=0;refinementConfig={...r};refinementStatus=null;isRefining=!1;constructor(e,t,n){this.parent=e,this.callbacks=n,this.createPanel()}setSceneType(e){this.sceneType=e,e===`mesh`&&(window.selectionMode=`orbit`,this.callbacks.onSelectionModeChanged(`orbit`),this.selectionCount=0,this.hasSamMask=!1),this.render()}setMeshInfo(e){this.meshInfo=e,this.render()}setRefinementStatus(e,t=!1){this.refinementStatus=e,this.isRefining=t,this.render()}setRefinementConfig(e){this.refinementConfig={...this.refinementConfig,...e},this.render()}updateSelectionCount(e,t=!1){this.selectionCount=e,this.hasSamMask=t,!t&&this.refinementConfig.useMultiViewConstraint&&(this.refinementConfig.useMultiViewConstraint=!1,this.callbacks.onUpdateRefinementConfig&&this.callbacks.onUpdateRefinementConfig({useMultiViewConstraint:!1})),this.render()}setGridEnabled(e){this.showGrid=e,this.render()}toggleCollapse(e){this.isPanelCollapsed=e===void 0?!this.isPanelCollapsed:e,this.render()}createPanel(){this.element=document.createElement(`div`),this.element.id=`editor-side-panel`,this.element.style.cssText=`
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
            transition: max-height 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
        `,this.parent.appendChild(this.element),this.render()}render(){if(!this.element)return;this.element.style.maxHeight=this.isPanelCollapsed?`48px`:`calc(100vh - 40px)`,this.element.style.overflowY=this.isPanelCollapsed?`hidden`:`auto`;let e=window.selectionMode||`orbit`;this.element.innerHTML=`
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
                    text-align: center;
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

            <!-- Panel Title / Header (Clickable to collapse/expand) -->
            <div id="panel-main-header" style="
                padding: 12px 16px;
                border-bottom: ${this.isPanelCollapsed?`none`:`1px solid rgba(255, 255, 255, 0.08)`};
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                user-select: none;
                background: ${this.isPanelCollapsed?`rgba(255, 255, 255, 0.04)`:`rgba(255, 255, 255, 0.02)`};
                transition: background 0.2s;
            " title="Click to ${this.isPanelCollapsed?`expand`:`collapse`} editor panel">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">🌌</span>
                    <span style="font-weight: 700; font-size: 15px; letter-spacing: 0.5px; background: linear-gradient(135deg, #a5b4fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">GauSSCol.SI Editor</span>
                    ${this.isPanelCollapsed&&this.selectionCount>0?`
                        <span style="font-size: 10px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 2px 7px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.3); font-weight: 600;">
                            ${this.selectionCount.toLocaleString()}
                        </span>
                    `:``}
                </div>
                <div id="btn-toggle-panel-collapse" style="
                    font-size: 11px;
                    color: #a5b4fc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.2s;
                ">
                    ${this.isPanelCollapsed?`▼`:`▲`}
                </div>
            </div>

            <!-- Collapsible Panel Body -->
            <div id="panel-body" style="
                display: ${this.isPanelCollapsed?`none`:`flex`};
                flex-direction: column;
            ">
            <!-- File Loading Button -->
            <div style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 8px;">
                <button class="panel-btn" id="btn-load-file" style="width: 100%; background: #818cf8; border-color: rgba(129, 140, 248, 0.4);">📁 Load File (.ply, .splat, .glb, .gltf, .stl)</button>
                <button class="panel-btn ${this.demoFlashed?``:`demo-flash`}" id="btn-load-demo" style="width: 100%; background: rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.2); color: #a5b4fc;">📦 Load Demo Room (.splat)</button>
                <div style="display: flex; gap: 6px; align-items: center; margin-top: 2px;">
                    <select id="select-demo-mesh" style="flex: 1; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: #cbd5e1; border-radius: 6px; padding: 6px 8px; font-size: 11px; font-family: inherit; cursor: pointer;">
                        <option value="test_assets/textured_box.glb">📦 Textured Box (.glb)</option>
                        <option value="test_assets/box_untextured.glb">📦 Simple Box (.glb)</option>
                        <option value="test_assets/pyramid_binary.stl">🔺 Binary Pyramid (.stl)</option>
                        <option value="test_assets/cube_ascii.stl">🎲 ASCII Cube (.stl)</option>
                    </select>
                    <button class="panel-btn" id="btn-load-demo-mesh" style="padding: 6px 10px; font-size: 11px; background: rgba(56, 189, 248, 0.15); border-color: rgba(56, 189, 248, 0.3); color: #38bdf8; white-space: nowrap;">Load Mesh</button>
                </div>
            </div>

            ${this.sceneType===`mesh`?`
            <!-- Mesh Scene Telemetry Info -->
            <div style="margin: 12px 16px 4px 16px; background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(129, 140, 248, 0.35); border-radius: 12px; padding: 12px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 12px; font-weight: 700; color: #a5b4fc;">📐 Scene Type: Mesh</span>
                    <span style="font-size: 10px; background: #4f46e5; color: white; padding: 2px 6px; border-radius: 4px; font-weight: 600;">V1</span>
                </div>
                <div style="font-size: 11px; color: rgba(255, 255, 255, 0.75); line-height: 1.6;">
                    <div>File: <span style="color: #fff; font-weight: 600;">${this.meshInfo?.filename||`Mesh Model`}</span></div>
                    <div>Vertices: <span style="color: #38bdf8; font-weight: 600;">${(this.meshInfo?.vertexCount||0).toLocaleString()}</span></div>
                    <div>Triangles: <span style="color: #38bdf8; font-weight: 600;">${(this.meshInfo?.triangleCount||0).toLocaleString()}</span></div>
                    <div>Materials: <span style="color: #38bdf8; font-weight: 600;">${this.meshInfo?.materialCount||0}</span></div>
                    <div>Textures: <span style="color: #38bdf8; font-weight: 600;">${this.meshInfo?.textureCount||0}</span></div>
                </div>
                <div style="font-size: 10px; color: #94a3b8; margin-top: 8px; line-height: 1.3; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 6px;">
                    ℹ️ Camera orbit, pan, zoom, fit-to-view, and Ask GauSSCol.SI VLM are active. Mesh triangle selection is reserved for V2.
                </div>
            </div>
            `:``}

            <!-- SECTION: Selection & Editing -->
            <div class="panel-section-header" id="header-sec">
                <span class="panel-section-title">🪄 Selection Tools</span>
                <span style="font-size: 10px; color: rgba(255,255,255,0.4);">${this.sectionCollapsed?`▼`:`▲`}</span>
            </div>
            <div class="panel-section-content" id="content-sec" style="display: ${this.sectionCollapsed?`none`:`block`};">
                ${this.sceneType===`mesh`?`
                <div style="font-size: 11.5px; color: #94a3b8; text-align: center; padding: 14px 10px; background: rgba(0,0,0,0.25); border-radius: 8px; line-height: 1.5;">
                    📐 <strong>Mesh Scene Active</strong><br/>
                    <span style="font-size: 10.5px; color: #64748b;">Lasso & SAM selection are disabled for meshes in V1.</span>
                </div>
                `:`
                <!-- Selection Mode Buttons -->
                <div style="display: flex; gap: 6px; margin-bottom: 16px;">
                    <button class="mode-btn ${e===`orbit`?`active`:``}" id="mode-orbit">Orbit</button>
                    <button class="mode-btn ${e===`lasso`?`active`:``}" id="mode-lasso">Select</button>
                </div>

                <!-- Lasso Selection Depth Slider -->
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 10px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-size: 11px; color: rgba(255, 255, 255, 0.75);">Lasso Depth:</span>
                        <span id="lasso-depth-val" style="font-size: 11px; font-weight: 700; color: #818cf8;">${this.lassoDepthRatio===0?`Surface`:this.lassoDepthRatio===1?`Full Depth`:Math.round(this.lassoDepthRatio*100)+`%`}</span>
                    </div>
                    <input type="range" id="slider-lasso-depth" min="0" max="1" step="0.05" value="${this.lassoDepthRatio}" style="width: 100%; cursor: pointer;" />
                    <div style="font-size: 10px; color: rgba(255, 255, 255, 0.45); margin-top: 5px; line-height: 1.3;">
                        💡 Appends to current selection by default.<br/>
                        Hold <kbd style="background: rgba(255,255,255,0.15); padding: 1px 4px; border-radius: 3px;">Ctrl</kbd> to Erase, <kbd style="background: rgba(255,255,255,0.15); padding: 1px 4px; border-radius: 3px;">Alt</kbd> for New.
                    </div>
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

                    <!-- Refine Selection Section -->
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; gap: 6px;">
                            <button class="panel-btn" id="btn-refine-selection" style="
                                flex: 1;
                                background: ${this.isRefining?`rgba(56, 189, 248, 0.25)`:`linear-gradient(135deg, #0284c7, #0369a1)`};
                                border: 1px solid #38bdf8;
                                color: #e0f2fe;
                                font-size: 11.5px;
                                font-weight: 700;
                                padding: 8px 6px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 4px;
                                box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);
                                cursor: ${this.selectionCount>0&&!this.isRefining?`pointer`:`not-allowed`};
                                opacity: ${this.selectionCount>0&&!this.isRefining?`1.0`:`0.45`};
                            " ${this.selectionCount>0&&!this.isRefining?``:`disabled`}>
                                <span>${this.isRefining?`⏳ Refining...`:`⚡ Refine Step`}</span>
                            </button>
                            <button class="panel-btn" id="btn-refine-completion" style="
                                flex: 1.25;
                                background: ${this.isRefining?`rgba(16, 185, 129, 0.25)`:`linear-gradient(135deg, #059669, #047857)`};
                                border: 1px solid #34d399;
                                color: #ecfdf5;
                                font-size: 11.5px;
                                font-weight: 700;
                                padding: 8px 6px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 4px;
                                box-shadow: 0 4px 14px rgba(5, 150, 105, 0.3);
                                cursor: ${this.selectionCount>0&&!this.isRefining?`pointer`:`not-allowed`};
                                opacity: ${this.selectionCount>0&&!this.isRefining?`1.0`:`0.45`};
                            " ${this.selectionCount>0&&!this.isRefining?``:`disabled`}>
                                <span>✨ Refine to Object</span>
                            </button>
                        </div>

                        <!-- Refinement Constraint Option Toggle -->
                        <div style="background: rgba(0, 0, 0, 0.25); border-radius: 8px; padding: 8px 10px; margin-top: 2px; border: 1px solid rgba(255, 255, 255, 0.05);">
                            <label style="display: flex; align-items: center; justify-content: space-between; cursor: ${this.hasSamMask?`pointer`:`not-allowed`}; opacity: ${this.hasSamMask?`1.0`:`0.45`}; font-size: 11px;">
                                <span style="font-weight: 600; color: #e2e8f0;">🔒 Restrict to SAM Mask (Option B)</span>
                                <input type="checkbox" id="refine-multiview-constraint" ${this.refinementConfig.useMultiViewConstraint?`checked`:``} ${this.hasSamMask?``:`disabled`} style="cursor: pointer; accent-color: #38bdf8;" />
                            </label>
                            <div style="font-size: 9.5px; color: ${this.hasSamMask?`#94a3b8`:`#64748b`}; margin-top: 3px; line-height: 1.3;">
                                ${this.hasSamMask?this.refinementConfig.useMultiViewConstraint?`Option B active: Refinement restricted to multi-view SAM masks.`:`Option A active: Pure adjacency growth without SAM mask bounds.`:`Option B disabled (only available after SAM segmentation).`}
                            </div>
                        </div>

                        ${this.refinementStatus?`
                            <div style="font-size: 11px; color: #7dd3fc; text-align: center; background: rgba(56, 189, 248, 0.1); border-radius: 6px; padding: 5px 8px; border: 1px solid rgba(56, 189, 248, 0.25);">
                                ${this.refinementStatus}
                            </div>
                        `:``}

                    </div>
                </div>
                `}
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
            </div> <!-- End #panel-body -->
        `,this.bindEvents()}bindEvents(){this.element&&(this.element.querySelector(`#panel-main-header`)?.addEventListener(`click`,()=>{this.isPanelCollapsed=!this.isPanelCollapsed,this.render()}),!this.isPanelCollapsed&&(this.element.querySelector(`#header-sec`)?.addEventListener(`click`,()=>{this.sectionCollapsed=!this.sectionCollapsed,this.render()}),this.element.querySelector(`#header-display-sec`)?.addEventListener(`click`,()=>{this.displayCollapsed=!this.displayCollapsed,this.render()}),this.element.querySelector(`#mode-orbit`)?.addEventListener(`click`,()=>{this.callbacks.onSelectionModeChanged(`orbit`),this.render()}),this.element.querySelector(`#mode-lasso`)?.addEventListener(`click`,()=>{this.callbacks.onSelectionModeChanged(`lasso`),this.render()}),this.element.querySelector(`#slider-lasso-depth`)?.addEventListener(`input`,e=>{let t=e.target;this.lassoDepthRatio=parseFloat(t.value);let n=this.element?.querySelector(`#lasso-depth-val`);n&&(n.textContent=this.lassoDepthRatio===0?`Surface`:this.lassoDepthRatio===1?`Full Depth`:Math.round(this.lassoDepthRatio*100)+`%`),this.callbacks.onLassoDepthChanged&&this.callbacks.onLassoDepthChanged(this.lassoDepthRatio)}),this.element.querySelector(`#btn-deselect`)?.addEventListener(`click`,()=>{this.callbacks.onClearSelection()}),this.element.querySelector(`#btn-delete`)?.addEventListener(`click`,()=>{confirm(`Are you sure you want to delete the selected splats?`)&&this.callbacks.onDeleteSelected()}),this.element.querySelector(`#btn-refine-selection`)?.addEventListener(`click`,()=>{this.callbacks.onRefineSelection&&this.selectionCount>0&&!this.isRefining&&this.callbacks.onRefineSelection()}),this.element.querySelector(`#btn-refine-completion`)?.addEventListener(`click`,()=>{this.callbacks.onRefineToCompletion&&this.selectionCount>0&&!this.isRefining&&this.callbacks.onRefineToCompletion()}),this.element.querySelector(`#refine-multiview-constraint`)?.addEventListener(`change`,e=>{let t=e.target;this.refinementConfig.useMultiViewConstraint=t.checked,this.callbacks.onUpdateRefinementConfig&&this.callbacks.onUpdateRefinementConfig({useMultiViewConstraint:t.checked}),this.render()}),this.element.querySelector(`#btn-load-file`)?.addEventListener(`click`,()=>{this.callbacks.onLoadFile()}),this.element.querySelector(`#btn-load-demo`)?.addEventListener(`click`,()=>{this.demoFlashed||(this.demoFlashed=!0,this.render()),this.callbacks.onLoadDemo()}),this.element.querySelector(`#btn-load-demo-mesh`)?.addEventListener(`click`,()=>{let e=this.element?.querySelector(`#select-demo-mesh`)?.value||`test_assets/textured_box.glb`;this.callbacks.onLoadDemoMesh&&this.callbacks.onLoadDemoMesh(e)}),this.element.querySelector(`#toggle-grid`)?.addEventListener(`change`,e=>{let t=e.target;this.showGrid=t.checked,this.callbacks.onToggleGrid(this.showGrid)})))}},s=class{baseUrl;constructor(e=`http://127.0.0.1:8010`){this.baseUrl=e.replace(/\/+$/,``)}getBaseUrl(){return this.baseUrl}setBaseUrl(e){this.baseUrl=e.replace(/\/+$/,``)}async checkHealth(){try{let e=new AbortController,t=setTimeout(()=>e.abort(),4e3),n=await fetch(`${this.baseUrl}/health`,{signal:e.signal});if(clearTimeout(t),!n.ok)throw Error(`Health check failed: HTTP ${n.status}`);return await n.json()}catch(e){console.warn(`[GauSSCol Vision] Failed to connect to ${this.baseUrl}/health:`,e),typeof window<`u`&&window.location.protocol===`https:`&&console.warn(`[GauSSCol Vision] Browser is running on HTTPS. Browsers block HTTP to localhost unless 'Insecure content' is set to 'Allow' in Site settings.`);let t=this.baseUrl.includes(`127.0.0.1`)?this.baseUrl.replace(`127.0.0.1`,`localhost`):this.baseUrl.includes(`localhost`)?this.baseUrl.replace(`localhost`,`127.0.0.1`):null;if(t)try{let e=new AbortController,n=setTimeout(()=>e.abort(),3e3),r=await fetch(`${t}/health`,{signal:e.signal});if(clearTimeout(n),r.ok)return this.baseUrl=t,await r.json()}catch{}return{status:`unavailable`,model:`none`,device:`none`,cuda_available:!1,dtype:`none`,ready:!1}}}async query(e,t){let n=new FormData;n.append(`metadata`,JSON.stringify(e));for(let[e,r]of t.entries())n.append(`images`,r,`${e}.jpg`);let r=new AbortController,i=setTimeout(()=>r.abort(),3e5);try{let e=await fetch(`${this.baseUrl}/api/v1/vision/query`,{method:`POST`,body:n,signal:r.signal});if(clearTimeout(i),!e.ok){let t=await e.text().catch(()=>``);throw Error(`Vision service error (${e.status}): ${t||e.statusText}`)}return await e.json()}catch(e){throw clearTimeout(i),e.name===`AbortError`?Error(`Vision query timed out after 300 seconds.`):Error(`Failed to connect to GauSSCol.SI Vision at ${this.baseUrl}: ${e.message}`)}}async shutdown(){try{let e=new AbortController,t=setTimeout(()=>e.abort(),2e3);return await fetch(`${this.baseUrl}/api/v1/system/shutdown`,{method:`POST`,signal:e.signal}),clearTimeout(t),!0}catch{return!0}}},c=class e{container;svgElement;observations=[];activeViewId=`current`;viewMasks=new Map;showSamMask=!1;showBoundingBoxes=!0;constructor(e){this.container=e,this.svgElement=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`),this.svgElement.id=`vision-bbox-overlay`,this.svgElement.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 50;
        `,this.container.appendChild(this.svgElement),window.addEventListener(`resize`,()=>this.render())}setObservations(e,t=`current`){this.observations=e,this.activeViewId=t,this.render()}setSamMask(e,t=`current`){e?(this.viewMasks.set(t,e),this.showSamMask=!0):this.viewMasks.delete(t),this.render()}clearSamMasks(){this.viewMasks.clear(),this.render()}toggleSamMask(e){return this.showSamMask=e===void 0?!this.showSamMask:e,this.render(),this.showSamMask}isShowingSamMask(){return this.showSamMask}toggleBoundingBoxes(e){return this.showBoundingBoxes=e===void 0?!this.showBoundingBoxes:e,this.render(),this.showBoundingBoxes}isShowingBoundingBoxes(){return this.showBoundingBoxes}setActiveView(e){this.activeViewId=e,this.render()}clear(){this.observations=[],this.viewMasks.clear(),this.render()}static normalizedBBoxToCanvas(e,t,n){let r=e.x_min*t,i=e.y_min*n,a=(e.x_max-e.x_min)*t,o=(e.y_max-e.y_min)*n;return{x:r,y:i,width:Math.max(2,a),height:Math.max(2,o)}}render(){for(;this.svgElement.firstChild;)this.svgElement.removeChild(this.svgElement.firstChild);let t=this.container.getBoundingClientRect(),n=t.width,r=t.height,i=this.viewMasks.get(this.activeViewId)||(this.activeViewId===`context`?this.viewMasks.get(`current`):void 0)||(this.activeViewId===`current`?Array.from(this.viewMasks.values())[0]:void 0);if(this.showSamMask&&i){let e=document.createElementNS(`http://www.w3.org/2000/svg`,`image`);e.setAttribute(`href`,i),e.setAttribute(`x`,`0`),e.setAttribute(`y`,`0`),e.setAttribute(`width`,n.toString()),e.setAttribute(`height`,r.toString()),e.setAttribute(`preserveAspectRatio`,`none`),e.style.opacity=`0.50`,e.style.pointerEvents=`none`,e.style.mixBlendMode=`screen`,e.style.filter=`drop-shadow(0 0 10px rgba(56, 189, 248, 0.9))`,this.svgElement.appendChild(e)}if(this.showBoundingBoxes){let t=this.observations.filter(e=>e.bbox&&(e.view_id===this.activeViewId||e.view_id===`current`));t.length===0&&this.activeViewId===`current`&&(t=this.observations.filter(e=>!!e.bbox));for(let i=0;i<t.length;i++){let a=t[i];if(!a.bbox)continue;let o=e.normalizedBBoxToCanvas(a.bbox,n,r),s=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`);s.setAttribute(`x`,o.x.toString()),s.setAttribute(`y`,o.y.toString()),s.setAttribute(`width`,o.width.toString()),s.setAttribute(`height`,o.height.toString()),s.setAttribute(`fill`,`rgba(56, 189, 248, 0.12)`),s.setAttribute(`stroke`,`#38bdf8`),s.setAttribute(`stroke-width`,`2.5`),s.setAttribute(`rx`,`4`),s.style.pointerEvents=`auto`,s.style.cursor=`pointer`;let c=document.createElementNS(`http://www.w3.org/2000/svg`,`g`);c.appendChild(s);let l=a.confidence==null?a.label:`${a.label} (${Math.round(a.confidence*100)}%)`,u=document.createElementNS(`http://www.w3.org/2000/svg`,`text`);u.textContent=l,u.setAttribute(`x`,(o.x+8).toString()),u.setAttribute(`y`,Math.max(16,o.y-6).toString()),u.setAttribute(`fill`,`#ffffff`),u.setAttribute(`font-size`,`12px`),u.setAttribute(`font-weight`,`600`),u.setAttribute(`font-family`,`'Outfit', 'Inter', sans-serif`);let d=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`),f=l.length*7.5+14;if(d.setAttribute(`x`,o.x.toString()),d.setAttribute(`y`,Math.max(2,o.y-20).toString()),d.setAttribute(`width`,f.toString()),d.setAttribute(`height`,`18`),d.setAttribute(`rx`,`4`),d.setAttribute(`fill`,`#0284c7`),d.setAttribute(`opacity`,`0.92`),c.appendChild(d),c.appendChild(u),a.description){let e=document.createElementNS(`http://www.w3.org/2000/svg`,`title`);e.textContent=`${a.label}: ${a.description}`,c.appendChild(e)}this.svgElement.appendChild(c)}}}},l={defaultBaseUrl:`http://127.0.0.1:8010`,publicRepoUrl:`https://github.com/sreenvenkitr/GauSSColVision`,downloadUrl:null,documentationUrl:`https://github.com/sreenvenkitr/GauSSColVision#readme`,healthTimeoutMs:3500,geminiApiKeyUrl:`https://aistudio.google.com/app/apikey`,openrouterApiKeyUrl:`https://openrouter.ai/keys`,openaiApiKeyUrl:`https://platform.openai.com/api-keys`},u=class{parent;modalElement=null;onCloseCallback;onTestConnectionCallback;constructor(e,t,n){this.parent=e,this.onCloseCallback=t,this.onTestConnectionCallback=n}show(){this.close(),this.modalElement=document.createElement(`div`),this.modalElement.id=`vision-server-setup-modal`,this.modalElement.style.cssText=`
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(15, 23, 42, 0.96);
            border: 1px solid rgba(255, 255, 255, 0.16);
            border-radius: 16px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            z-index: 500;
            display: flex;
            flex-direction: column;
            width: min(680px, 92vw);
            max-height: 88vh;
            color: #f8fafc;
            font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
            overflow: hidden;
        `;let e=document.createElement(`div`);e.style.cssText=`
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.02);
        `,e.innerHTML=`
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">⚡</span>
                <span style="font-weight: 700; font-size: 16px; color: #38bdf8; letter-spacing: 0.3px;">GauSSCol Vision Server Setup</span>
            </div>
            <button id="close-setup-modal-btn" style="
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 8px;
                color: #94a3b8;
                font-size: 16px;
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s;
            " title="Close">&times;</button>
        `;let t=document.createElement(`div`);t.style.cssText=`
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            font-size: 12.5px;
            line-height: 1.6;
        `,t.innerHTML=`
            <style>
                #vision-server-setup-modal code {
                    display: inline !important;
                    background: rgba(0, 0, 0, 0.45) !important;
                    color: #38bdf8 !important;
                    padding: 2px 6px !important;
                    border-radius: 4px !important;
                    border: 1px solid rgba(56, 189, 248, 0.25) !important;
                    font-family: ui-monospace, Consolas, monospace !important;
                    font-size: 11.5px !important;
                }
                #vision-server-setup-modal pre {
                    background: rgba(0, 0, 0, 0.5) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 8px !important;
                    padding: 10px 14px !important;
                    color: #cbd5e1 !important;
                    font-family: ui-monospace, Consolas, monospace !important;
                    font-size: 11.5px !important;
                    line-height: 1.55 !important;
                    margin: 8px 0 !important;
                    overflow-x: auto !important;
                }
            </style>

            <!-- Short intro banner -->
            <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 10px; padding: 12px 14px;">
                <div style="font-weight: 700; color: #7dd3fc; font-size: 13px; margin-bottom: 3px;">Local AI Vision Service</div>
                <div style="color: #cbd5e1; font-size: 11.5px; line-height: 1.5;">
                    Ask GauSSCol.SI connects to a lightweight local companion server on your PC for visual scene reasoning and semantic object selection.
                </div>
            </div>

            <!-- Step 1 -->
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px;">
                <div style="font-weight: 700; font-size: 13px; color: #f8fafc; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                    <span style="background: #0284c7; color: white; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">1</span>
                    Run Local Vision Server
                </div>
                <div style="color: #94a3b8; font-size: 11.5px;">
                    Clone the companion repository (or open your local <code>GauSSColVision/</code> folder) and run:
                </div>
                <pre>git clone https://github.com/sreenvenkitr/GauSSColVision.git
cd GauSSColVision
run_server.bat</pre>
                <div style="color: #64748b; font-size: 11px;">
                    Starts local API service at <code>http://127.0.0.1:8010</code>.
                </div>
            </div>

            <!-- Step 2 -->
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px;">
                <div style="font-weight: 700; font-size: 13px; color: #f8fafc; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                    <span style="background: #0284c7; color: white; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">2</span>
                    Set Up Gemini API Key (.env)
                </div>
                <div style="color: #94a3b8; font-size: 11.5px;">
                    Copy <code>.env.example</code> to <code>.env</code> inside <code>GauSSColVision/</code> and insert your free Gemini API key:
                </div>
                <pre>VISION_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
VISION_GEMINI_MODEL=gemini-flash-lite-latest</pre>
                <div style="font-size: 11px; color: #64748b;">
                    Need an API key? Generate one at <a href="${l.geminiApiKeyUrl}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: underline;">Google AI Studio</a>.
                </div>
            </div>

            <!-- Step 3 -->
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px;">
                <div style="font-weight: 700; font-size: 13px; color: #f8fafc; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                    <span style="background: #0284c7; color: white; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">3</span>
                    Verify Connection
                </div>
                <div style="color: #cbd5e1; font-size: 11.5px; line-height: 1.45;">
                    Once running, test the connection below or click <strong>⟳ Retry Connection</strong> in the Ask GauSSCol panel:
                </div>
                <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <button id="modal-test-conn-btn" style="
                        background: #0284c7; border: none; border-radius: 6px; padding: 7px 14px;
                        color: white; font-weight: 600; font-size: 11.5px; cursor: pointer; display: flex; align-items: center; gap: 5px;
                        transition: background 0.15s;
                    ">
                        <span>⟳ Test & Connect Now</span>
                    </button>
                    <span id="modal-conn-status" style="font-size: 11.5px; color: #94a3b8;"></span>
                </div>
                ${typeof window<`u`&&window.location.protocol===`https:`?`
                <div style="margin-top: 10px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 8px; padding: 10px 12px; font-size: 11px; color: #fde68a; line-height: 1.5;">
                    <div style="font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 5px;">
                        <span>🔒</span> Connecting from HTTPS (Chrome / Edge PNA Check)
                    </div>
                    <div>
                        Modern Chrome blocks public HTTPS pages from calling local HTTP (127.0.0.1) under <em>Local Network Access</em> rules. To allow connection:
                    </div>
                    <ol style="margin: 6px 0 6px 18px; padding: 0;">
                        <li>Open a tab to <code style="user-select: all; background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 3px;">chrome://flags/#local-network-access-check</code> (or <code style="user-select: all; background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 3px;">#block-insecure-private-network-requests</code>).</li>
                        <li>Change dropdown to <strong>Disabled</strong> and click <strong>Relaunch</strong>.</li>
                        <li>Refresh this page and click <strong>⟳ Retry Connection</strong>.</li>
                    </ol>
                    <div style="color: #94a3b8; font-size: 10.5px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 5px; margin-top: 4px;">
                        <em>Zero-configuration alternative:</em> Run UI locally with <code style="background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 3px;">python -m http.server 8000</code> in GauSSCol-Demo and open <code style="background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 3px;">http://localhost:8000</code>.
                    </div>
                </div>
                `:``}
            </div>

            <!-- Privacy Guarantee Box -->
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 10px; padding: 11px 14px;">
                <div style="display: flex; gap: 6px; align-items: center; font-weight: 700; color: #34d399; margin-bottom: 3px; font-size: 12px;">
                    <span>🛡️</span> Privacy Guarantee
                </div>
                <div style="color: #a7f3d0; font-size: 11px; line-height: 1.45;">
                    Your API key remains strictly on your local PC in <code>.env</code>. The browser web app only communicates with <code>http://127.0.0.1:8010</code>.
                </div>
            </div>
        `;let n=document.createElement(`div`);n.style.cssText=`
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 12px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.02);
            gap: 10px;
        `,n.innerHTML=`
            <a href="${l.documentationUrl}" target="_blank" rel="noopener noreferrer" style="
                color: #38bdf8; font-size: 12px; text-decoration: none; display: flex; align-items: center; gap: 4px; margin-right: auto;
            ">
                <span>📖 Online Documentation</span>
            </a>
            <button id="close-setup-modal-footer-btn" style="
                padding: 8px 18px;
                background: #0284c7;
                border: none;
                border-radius: 8px;
                color: white;
                font-size: 12.5px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.15s;
            ">Got it</button>
        `,this.modalElement.appendChild(e),this.modalElement.appendChild(t),this.modalElement.appendChild(n),this.parent.appendChild(this.modalElement),this.modalElement.addEventListener(`click`,e=>e.stopPropagation()),e.querySelector(`#close-setup-modal-btn`)?.addEventListener(`click`,()=>this.close()),n.querySelector(`#close-setup-modal-footer-btn`)?.addEventListener(`click`,()=>this.close());let r=this.modalElement.querySelector(`#modal-test-conn-btn`),i=this.modalElement.querySelector(`#modal-conn-status`);r?.addEventListener(`click`,async()=>{r&&(r.disabled=!0),i&&(i.textContent=`⏳ Testing connection to http://127.0.0.1:8010...`,i.style.color=`#38bdf8`);try{let e=!1;e=this.onTestConnectionCallback?await this.onTestConnectionCallback():(await fetch(`http://127.0.0.1:8010/health`)).ok,e?(i&&(i.textContent=`✓ Connected to Vision Server!`,i.style.color=`#34d399`),setTimeout(()=>this.close(),1e3)):i&&(i.textContent=`✗ Server not responding on port 8010. Is run_server.bat running?`,i.style.color=`#f87171`)}catch(e){i&&(i.textContent=`✗ Connection error: ${e.message||`Server offline`}`,i.style.color=`#f87171`)}finally{r&&(r.disabled=!1)}})}close(){this.modalElement&&(this.modalElement.remove(),this.modalElement=null,this.onCloseCallback&&this.onCloseCallback())}isOpen(){return this.modalElement!==null}},d=class{parent;callbacks;element=null;collapsed=!1;isBusy=!1;isServerAvailable=!0;isCheckingConnection=!1;serverModel=``;statusMessage=`Ready`;lastResponse=null;capturedViews=new Map;conversationHistory=[];showingBoundingBoxes=!0;showingSamMask=!1;comprehensiveCoverage=!1;setupModal=null;constructor(e,t){this.parent=e,this.callbacks=t,this.createPanel()}setStatus(e,t=!1){this.statusMessage=e,this.isBusy=t;let n=this.element?.querySelector(`#vision-status-text`);n&&(n.textContent=e);let r=this.element?.querySelector(`#vision-send-btn`);r&&(r.disabled=t,r.style.opacity=t?`0.5`:`1.0`)}setServerStatus(e,t=``){this.isServerAvailable=e,this.serverModel=t,this.render()}setIsChecking(e){this.isCheckingConnection=e,this.render()}setResponse(e,t){this.lastResponse=e,this.capturedViews=t,e.segmentation?.views&&e.segmentation.views.length>0&&(this.showingSamMask=!0),this.render()}clearResponse(){this.lastResponse=null,this.capturedViews.clear(),this.render()}resetConversation(){this.conversationHistory=[],this.clearResponse()}addTurn(e,t){this.conversationHistory.push({role:`user`,content:e}),this.conversationHistory.push({role:`assistant`,content:t}),this.conversationHistory.length>10&&(this.conversationHistory=this.conversationHistory.slice(-10))}getConversationHistory(){return[...this.conversationHistory]}setComprehensiveCoverage(e){this.comprehensiveCoverage=e,this.render()}isComprehensiveCoverage(){return this.comprehensiveCoverage}openSetupModal(){this.setupModal||=new u(document.body,()=>{this.setupModal=null},async()=>(this.callbacks.onRetryConnection&&await this.callbacks.onRetryConnection(),this.isServerAvailable)),this.setupModal.show()}createPanel(){this.element=document.createElement(`div`),this.element.id=`ask-gausscol-panel`,this.element.style.cssText=`
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: 380px;
            max-height: calc(100vh - 120px);
            color: #f8fafc;
            background: rgba(15, 23, 42, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 16px;
            font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
            z-index: 100;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `,this.parent.appendChild(this.element),this.render()}render(){if(!this.element)return;let e=`#22c55e`,t=`rgba(34, 197, 94, 0.4)`,n=`Online`,r=`Online: ${this.serverModel||`Ready`} (port 8010)`;this.isCheckingConnection?(e=`#eab308`,t=`rgba(234, 179, 8, 0.4)`,n=`Checking...`,r=`Checking connection to local Vision Server...`):this.isServerAvailable?this.isBusy&&(e=`#eab308`,t=`rgba(234, 179, 8, 0.4)`,n=`Busy`,r=`Analyzing query...`):(e=`#ef4444`,t=`rgba(239, 68, 68, 0.4)`,n=`Offline`,r=`Local Vision Server is offline (http://127.0.0.1:8010). Click Setup for instructions.`),this.element.innerHTML=`
            <div id="vision-panel-header" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 14px;
                background: rgba(255, 255, 255, 0.03);
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                cursor: pointer;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 15px;">👁️</span>
                    <span style="font-weight: 700; font-size: 13.5px; letter-spacing: 0.3px; color: #38bdf8;">Ask GauSSCol.SI</span>
                    <span id="vision-server-status" title="${r}" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 5px;
                        font-size: 11px;
                        color: #94a3b8;
                        background: rgba(255, 255, 255, 0.04);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        padding: 1px 7px;
                        border-radius: 10px;
                        margin-left: 2px;
                        cursor: help;
                    ">
                        <span style="
                            width: 6.5px;
                            height: 6.5px;
                            border-radius: 50%;
                            background: ${e};
                            box-shadow: 0 0 5px ${t};
                            display: inline-block;
                        "></span>
                        <span style="font-weight: 500;">${n}</span>
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <button id="vision-header-setup-btn" style="
                        background: rgba(255, 255, 255, 0.08);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 6px;
                        color: #cbd5e1;
                        font-size: 11px;
                        padding: 3px 8px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 3px;
                        transition: background 0.15s;
                    " title="Vision Server Setup & Help">
                        <span>ℹ️ Setup</span>
                    </button>
                    <div id="vision-collapse-toggle" style="font-size: 13px; color: #94a3b8; padding: 2px 4px;">${this.collapsed?`▲`:`▼`}</div>
                </div>
            </div>

            <div id="vision-panel-body" style="
                display: ${this.collapsed?`none`:`flex`};
                flex-direction: column;
                padding: 14px 16px;
                gap: 12px;
                overflow-y: auto;
                max-height: calc(100vh - 180px);
            ">
                ${this.isServerAvailable?this.renderQueryInputArea():this.renderServerOfflineCard()}

                <!-- Status line -->
                <div style="font-size: 11px; color: #94a3b8; display: flex; align-items: center; justify-content: space-between;">
                    <span id="vision-status-text">${this.statusMessage}</span>
                    ${this.lastResponse?.metrics?`
                        <span style="font-family: monospace; color: #64748b;">${this.lastResponse.metrics.total_ms}ms</span>
                    `:``}
                </div>

                <!-- Results container -->
                ${this.lastResponse?this.renderResults():``}
            </div>
        `,this.attachEventListeners()}renderServerOfflineCard(){return`
            <div style="
                background: rgba(30, 41, 59, 0.7);
                border: 1px solid rgba(245, 158, 11, 0.35);
                border-radius: 12px;
                padding: 14px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            ">
                <div style="display: flex; gap: 10px; align-items: flex-start;">
                    <span style="font-size: 20px; line-height: 1;">🔌</span>
                    <div>
                        <div style="font-weight: 700; font-size: 13px; color: #f8fafc;">GauSSCol Vision Server is not running</div>
                        <div style="font-size: 11px; color: #94a3b8; line-height: 1.45; margin-top: 4px;">
                            Ask GauSSCol.SI uses a lightweight local Vision Server for AI-powered features such as multimodal understanding and semantic object selection.
                        </div>
                        <div style="font-size: 10.5px; color: #38bdf8; margin-top: 6px; line-height: 1.4;">
                            ✓ The 3D scene viewer, camera navigation, and selection tools remain fully functional in your browser.
                        </div>
                    </div>
                </div>

                ${typeof window<`u`&&window.location.protocol===`https:`?`
                <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 8px; padding: 10px 12px; font-size: 11px; color: #fde68a; line-height: 1.45;">
                    <div style="font-weight: 700; color: #fbbf24; margin-bottom: 3px; display: flex; align-items: center; gap: 5px;">
                        <span>🔒</span> Browser Mixed Content Notice
                    </div>
                    Running on <strong>HTTPS</strong> causes browsers to block local <code>http://127.0.0.1</code> calls by default.<br/>
                    👉 <strong>In Chrome/Edge:</strong> Click the <strong>lock/tune icon</strong> in the address bar ➔ <strong>Site settings</strong> ➔ set <strong>Insecure content</strong> to <strong>Allow</strong>, then reload.
                </div>
                `:``}

                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; gap: 8px;">
                        <button id="vision-download-btn" style="
                            flex: 1; padding: 8px 10px; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 7px;
                            color: #7dd3fc; font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;
                        ">
                            <span>📥 Download Server</span>
                            <span style="font-size: 9px; opacity: 0.8;">(Coming Soon)</span>
                        </button>
                        <button id="vision-setup-btn" style="
                            flex: 1; padding: 8px 10px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 7px;
                            color: #e2e8f0; font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;
                        ">
                            <span>📖 Setup Guide</span>
                        </button>
                    </div>
                    <button id="vision-retry-btn" style="
                        width: 100%; padding: 8px 12px; background: #0284c7; border: none; border-radius: 7px;
                        color: white; font-size: 11.5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
                        transition: background 0.15s;
                    " ${this.isCheckingConnection?`disabled`:``}>
                        <span>${this.isCheckingConnection?`⏳ Checking connection...`:`⟳ Retry Connection`}</span>
                    </button>
                </div>
            </div>
        `}renderQueryInputArea(){return`
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <textarea id="vision-question-input" placeholder="Ask a question about the scene (e.g., 'select the chair')..." rows="3" style="
                    width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 8px; padding: 10px 12px; color: #ffffff; font-size: 13px; font-family: inherit; resize: none; outline: none; line-height: 1.4;
                "></textarea>

                <!-- Seeding Coverage Mode Selector -->
                <label style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    font-size: 11px;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 6px;
                    padding: 6px 10px;
                    user-select: none;
                ">
                    <span style="color: #e2e8f0; font-weight: 600;">✨ Maximize Splat Coverage (Full Object)</span>
                    <input type="checkbox" id="toggle-comprehensive-coverage" ${this.comprehensiveCoverage?`checked`:``} style="cursor: pointer; accent-color: #38bdf8;" />
                </label>
                <div style="font-size: 9.5px; color: #94a3b8; margin-top: -4px; margin-bottom: 2px; line-height: 1.3;">
                    ${this.comprehensiveCoverage?`Captures ~80-95% of object splats across multi-view consensus.`:`Conservative mode: sparse seeds via strict multi-view intersection.`}
                </div>

                <div style="display: flex; gap: 8px;">
                    <button id="vision-send-btn" style="
                        flex: 1; padding: 9px 14px; background: #0284c7; border: none; border-radius: 8px;
                        color: white; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
                        transition: background 0.2s;
                    ">
                        <span>Analyze</span>
                    </button>

                    <button id="vision-clear-btn" style="
                        padding: 9px 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                        color: #cbd5e1; font-size: 13px; cursor: pointer; transition: background 0.2s;
                    ">Clear</button>
                </div>
            </div>
        `}renderResults(){if(!this.lastResponse)return``;let e=this.lastResponse;return`
            <div style="
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 10px;
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            ">
                <!-- Semantic Selection Card (for SELECT_OBJECT intent) -->
                ${e.intent===`SELECT_OBJECT`?`
                    <div style="
                        background: rgba(14, 165, 233, 0.15);
                        border: 1px solid rgba(14, 165, 233, 0.4);
                        border-radius: 8px;
                        padding: 10px;
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                    ">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 12px; color: #38bdf8;">
                                <span>🎯</span> Semantic Selection
                            </div>
                            ${e.target?`<span style="font-size: 11px; padding: 2px 6px; background: rgba(56, 189, 248, 0.2); border-radius: 4px; color: #7dd3fc;">${e.target.description||e.target.label}</span>`:``}
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #cbd5e1; margin-top: 4px; flex-wrap: wrap; gap: 6px;">
                            <span>${e.segmentation?.views?.length?`SAM 2.1 segmented ${e.segmentation.views.length} views`:``}</span>
                            <div style="display: flex; gap: 6px; align-items: center;">
                                <button id="toggle-bbox-btn" style="
                                    background: rgba(14, 165, 233, 0.25);
                                    border: 1px solid #38bdf8;
                                    color: #e0f2fe;
                                    border-radius: 4px;
                                    padding: 3px 8px;
                                    font-size: 10.5px;
                                    cursor: pointer;
                                    font-weight: 600;
                                    ">${this.showingBoundingBoxes?`Hide Rectangle`:`Show Rectangle`}</button>
                                ${e.segmentation?.views?.length?`
                                    <button id="toggle-sam-mask-btn" style="
                                        background: rgba(14, 165, 233, 0.25);
                                        border: 1px solid #38bdf8;
                                        color: #e0f2fe;
                                        border-radius: 4px;
                                        padding: 3px 8px;
                                        font-size: 10.5px;
                                        cursor: pointer;
                                        font-weight: 600;
                                    ">${this.showingSamMask?`Hide SAM Mask`:`Show SAM Mask`}</button>
                                `:``}
                            </div>
                        </div>
                    </div>
                `:``}

                <!-- Answer -->
                <div>
                    <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #38bdf8; margin-bottom: 4px;">Answer</div>
                    <div style="font-size: 13px; line-height: 1.4; color: #f1f5f9;">${e.answer}</div>
                </div>

                <!-- Observations -->
                ${e.observations&&e.observations.length>0?`
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8;">Observations (${e.observations.length})</div>
                            ${e.observations.some(e=>e.bbox)&&e.intent!==`SELECT_OBJECT`?`
                                <button id="toggle-obs-bbox-btn" style="
                                    background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15);
                                    border-radius: 4px; color: #cbd5e1; font-size: 10px; padding: 2px 6px; cursor: pointer;
                                ">${this.showingBoundingBoxes?`Hide Rectangles`:`Show Rectangles`}</button>
                            `:``}
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px; max-height: 140px; overflow-y: auto;">
                            ${e.observations.map(e=>`
                                <div style="
                                    font-size: 11px; background: rgba(255, 255, 255, 0.04); padding: 6px 8px; border-radius: 6px;
                                    display: flex; justify-content: space-between; align-items: center;
                                ">
                                    <div>
                                        <span style="font-weight: 600; color: #e2e8f0;">${e.label}</span>
                                        ${e.description?`<span style="color: #94a3b8; margin-left: 4px;">- ${e.description}</span>`:``}
                                    </div>
                                    <div style="display: flex; gap: 4px; align-items: center;">
                                        ${e.confidence?`<span style="color: #64748b; font-size: 10px;">${Math.round(e.confidence*100)}%</span>`:``}
                                        <button class="show-view-btn" data-viewid="${e.view_id}" style="
                                            background: #0284c7; border: none; border-radius: 4px; color: white;
                                            font-size: 10px; padding: 2px 6px; cursor: pointer;
                                        ">View</button>
                                    </div>
                                </div>
                            `).join(``)}
                        </div>
                    </div>
                `:``}

                <!-- Recommended Next View -->
                ${e.recommended_next_view&&e.recommended_next_view.required?`
                    <div style="
                        background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 8px;
                        padding: 8px 10px; display: flex; flex-direction: column; gap: 6px;
                    ">
                        <div style="font-size: 11px; font-weight: 600; color: #facc15; display: flex; align-items: center; gap: 4px;">
                            <span>💡</span> Recommended Viewpoint
                        </div>
                        <div style="font-size: 11px; color: #fef08a;">
                            ${e.recommended_next_view.reason||`Better viewing angle available for this inspection.`}
                        </div>
                        <button id="vision-rec-view-btn" style="
                            padding: 6px 10px; background: #eab308; border: none; border-radius: 6px;
                            color: #0f172a; font-size: 11px; font-weight: 600; cursor: pointer; align-self: flex-start;
                        ">
                            Navigate to Viewpoint
                        </button>
                    </div>
                `:``}

                <!-- Uncertainty explanation -->
                ${e.uncertainty?`
                    <div style="font-size: 11px; color: #f87171; background: rgba(239, 68, 68, 0.1); padding: 6px 8px; border-radius: 6px;">
                        ⚠️ ${e.uncertainty}
                    </div>
                `:``}

                <!-- Debug & Performance Summary -->
                <div style="
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    padding-top: 8px;
                    margin-top: 4px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    font-size: 10px;
                    color: #94a3b8;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: #cbd5e1;">Diagnostics</span>
                        ${e.metrics?.device?`<span style="color: #64748b;">${e.metrics.device}</span>`:``}
                    </div>
                    ${e.debug_info?.model?`
                        <div><strong style="color: #38bdf8;">Model:</strong> ${e.debug_info.model}</div>
                    `:``}
                    ${e.metrics?`
                        <div style="display: flex; flex-wrap: wrap; gap: 6px 12px; margin-top: 2px; color: #94a3b8;">
                            <span>Gemini: ${e.debug_info?.gemini_ms||e.metrics.gemini_ms||0}ms</span>
                            <span>SAM: ${e.debug_info?.sam_ms||e.metrics.sam_total_ms||0}ms</span>
                            <span>Total: ${e.debug_info?.total_ms||e.metrics.total_ms||0}ms</span>
                        </div>
                    `:``}
                </div>
            </div>
        `}attachEventListeners(){if(!this.element)return;this.element.querySelector(`#vision-panel-header`)?.addEventListener(`click`,e=>{e.target.closest(`#vision-header-setup-btn`)||(this.collapsed=!this.collapsed,this.render())}),this.element.querySelector(`#vision-header-setup-btn`)?.addEventListener(`click`,e=>{e.stopPropagation(),this.openSetupModal()}),this.element.querySelector(`#vision-setup-btn`)?.addEventListener(`click`,e=>{e.stopPropagation(),this.openSetupModal()}),this.element.querySelector(`#vision-download-btn`)?.addEventListener(`click`,e=>{e.stopPropagation(),l.downloadUrl?window.open(l.downloadUrl,`_blank`):this.openSetupModal()}),this.element.querySelector(`#vision-retry-btn`)?.addEventListener(`click`,async e=>{e.stopPropagation(),this.callbacks.onRetryConnection&&await this.callbacks.onRetryConnection()});let e=this.element.querySelector(`#vision-question-input`);e&&(e.addEventListener(`keydown`,e=>e.stopPropagation()),e.addEventListener(`keyup`,e=>e.stopPropagation()),e.addEventListener(`keypress`,e=>e.stopPropagation())),this.element.querySelector(`#vision-send-btn`)?.addEventListener(`click`,async t=>{t.stopPropagation();let n=e?.value.trim();if(!n){alert(`Please enter a question to analyze.`);return}await this.callbacks.onRunQuery(n)}),this.element.querySelector(`#vision-clear-btn`)?.addEventListener(`click`,e=>{e.stopPropagation(),this.clearResponse(),this.callbacks.onClear()}),this.element.querySelectorAll(`.show-view-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.dataset.viewid;n&&this.callbacks.onShowView&&this.callbacks.onShowView(n)})}),this.element.querySelector(`#vision-rec-view-btn`)?.addEventListener(`click`,async e=>{if(e.stopPropagation(),this.lastResponse?.recommended_next_view&&this.callbacks.onGenerateRecommendedView){let e=this.lastResponse.recommended_next_view;await this.callbacks.onGenerateRecommendedView(e.yaw_delta_deg||0,e.pitch_delta_deg||0,e.zoom_factor||1)}});let t=e=>{if(e.stopPropagation(),this.callbacks.onToggleBoundingBoxes){let e=this.callbacks.onToggleBoundingBoxes();this.showingBoundingBoxes=typeof e==`boolean`?e:!this.showingBoundingBoxes}else this.showingBoundingBoxes=!this.showingBoundingBoxes;let t=this.showingBoundingBoxes?`Hide Rectangle`:`Show Rectangle`,n=this.showingBoundingBoxes?`Hide Rectangles`:`Show Rectangles`,r=this.element?.querySelector(`#toggle-bbox-btn`);r&&(r.textContent=t);let i=this.element?.querySelector(`#toggle-obs-bbox-btn`);i&&(i.textContent=n)};this.element.querySelector(`#toggle-bbox-btn`)?.addEventListener(`click`,t),this.element.querySelector(`#toggle-obs-bbox-btn`)?.addEventListener(`click`,t);let n=this.element.querySelector(`#toggle-sam-mask-btn`);n?.addEventListener(`click`,e=>{if(e.stopPropagation(),this.callbacks.onToggleSamMask){let e=this.callbacks.onToggleSamMask();this.showingSamMask=typeof e==`boolean`?e:!this.showingSamMask}else this.showingSamMask=!this.showingSamMask;n&&(n.textContent=this.showingSamMask?`Hide SAM Mask`:`Show SAM Mask`)});let r=this.element.querySelector(`#toggle-comprehensive-coverage`);r?.addEventListener(`change`,()=>{this.comprehensiveCoverage=r.checked,this.callbacks.onCoverageModeChanged&&this.callbacks.onCoverageModeChanged(this.comprehensiveCoverage),this.render()})}},f=class{parent;modalElement=null;constructor(e){this.parent=e}show(e,t){this.close(),this.modalElement=document.createElement(`div`),this.modalElement.id=`view-inspector-modal`,this.modalElement.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 14px;
            box-shadow: 0 25px 60px rgba(0,0,0,0.8);
            backdrop-filter: blur(20px);
            z-index: 300;
            display: flex;
            flex-direction: column;
            padding: 16px;
            gap: 12px;
            max-width: 80vw;
            max-height: 85vh;
            color: white;
            font-family: 'Outfit', 'Inter', sans-serif;
        `;let n=document.createElement(`div`);n.style.cssText=`
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 8px;
        `,n.innerHTML=`
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 700; font-size: 14px; color: #38bdf8;">Inspecting View: ${e.viewId}</span>
                <span style="font-size: 11px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 2px 8px; border-radius: 6px;">${e.role}</span>
            </div>
            <button id="close-modal-btn" style="
                background: transparent; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; padding: 2px 6px;
            ">&times;</button>
        `;let r=document.createElement(`div`);r.style.cssText=`
            position: relative;
            display: inline-block;
            overflow: hidden;
            border-radius: 8px;
            background: #000;
        `;let i=document.createElement(`img`);if(i.src=e.dataUrl,i.style.cssText=`
            display: block;
            max-width: 70vw;
            max-height: 65vh;
            object-fit: contain;
        `,r.appendChild(i),t&&t.bbox){let e=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);e.style.cssText=`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            `,i.onload=()=>{let n=i.clientWidth,r=i.clientHeight,a=t.bbox,o=a.x_min*n,s=a.y_min*r,c=(a.x_max-a.x_min)*n,l=(a.y_max-a.y_min)*r,u=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`);u.setAttribute(`x`,o.toString()),u.setAttribute(`y`,s.toString()),u.setAttribute(`width`,c.toString()),u.setAttribute(`height`,l.toString()),u.setAttribute(`fill`,`rgba(56, 189, 248, 0.2)`),u.setAttribute(`stroke`,`#38bdf8`),u.setAttribute(`stroke-width`,`3`),u.setAttribute(`rx`,`4`);let d=document.createElementNS(`http://www.w3.org/2000/svg`,`rect`),f=t.label;d.setAttribute(`x`,o.toString()),d.setAttribute(`y`,Math.max(0,s-22).toString()),d.setAttribute(`width`,(f.length*8+16).toString()),d.setAttribute(`height`,`20`),d.setAttribute(`fill`,`#0284c7`),d.setAttribute(`rx`,`4`);let p=document.createElementNS(`http://www.w3.org/2000/svg`,`text`);p.textContent=f,p.setAttribute(`x`,(o+8).toString()),p.setAttribute(`y`,Math.max(14,s-8).toString()),p.setAttribute(`fill`,`#ffffff`),p.setAttribute(`font-size`,`12px`),p.setAttribute(`font-weight`,`bold`),e.appendChild(u),e.appendChild(d),e.appendChild(p)},r.appendChild(e)}let a=document.createElement(`div`);a.style.cssText=`
            font-size: 12px;
            color: #cbd5e1;
            line-height: 1.4;
        `,t&&t.description&&(a.innerHTML=`<strong>Observation:</strong> ${t.description}`),this.modalElement.appendChild(n),this.modalElement.appendChild(r),t&&t.description&&this.modalElement.appendChild(a),this.parent.appendChild(this.modalElement),n.querySelector(`#close-modal-btn`)?.addEventListener(`click`,()=>{this.close()})}close(){this.modalElement&&this.modalElement.parentElement&&this.modalElement.parentElement.removeChild(this.modalElement),this.modalElement=null}},p={MAP_READ:1,MAP_WRITE:2,COPY_SRC:4,COPY_DST:8,UNIFORM:64,STORAGE:128},m={VERTEX:1,FRAGMENT:2,COMPUTE:4},h={COPY_SRC:1,COPY_DST:2,TEXTURE_BINDING:4,STORAGE_BINDING:8,RENDER_ATTACHMENT:16},g={READ:1,WRITE:2},_=class{device;splatBuffer=null;splatCount=0;pipeline=null;bindGroupLayout=null;constructor(e){this.device=e,this.initPipeline()}setSplatBuffer(e){if(this.splatCount=Math.floor(e.byteLength/32),this.splatCount===0)return;this.splatBuffer&&=(this.splatBuffer.destroy(),null);let t=this.splatCount*32;this.splatBuffer=this.device.createBuffer({size:t,usage:p.STORAGE|p.COPY_DST});let n=new Uint8Array(e,0,t);this.device.queue.writeBuffer(this.splatBuffer,0,n.buffer,n.byteOffset,t),console.log(`[GaussianIdPass] Uploaded ${this.splatCount} splats to GPU storage buffer (${t} bytes).`)}getSplatCount(){return this.splatCount}initPipeline(){let e=this.device.createShaderModule({code:`
struct Uniforms {
    viewMatrix       : mat4x4<f32>,
    projMatrix       : mat4x4<f32>,
    camera_position  : vec3<f32>,
    tan_fovx         : f32,
    tan_fovy         : f32,
    focal_x          : f32,
    focal_y          : f32,
    scale_modifier   : f32,
    screen_size      : vec2<u32>,
    opacity_threshold: f32,
    _pad0            : f32,
};

struct SplatRaw {
    pos_x     : f32,
    pos_y     : f32,
    pos_z     : f32,
    scale_x   : f32,
    scale_y   : f32,
    scale_z   : f32,
    color_rgba: u32,
    rot_quat  : u32,
};

const QUAD_CORNERS = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
);

@group(0) @binding(0) var<uniform>       uniforms   : Uniforms;
@group(0) @binding(1) var<storage, read> splat_data : array<SplatRaw>;

struct VSOut {
    @builtin(position) position  : vec4<f32>,
    @location(0)       uv        : vec2<f32>,
    @location(1)       conic     : vec3<f32>,
    @location(2)       opacity   : f32,
    @location(3) @interpolate(flat) gauss_idx : u32,
};

fn compute_cov3d(scale: vec3<f32>, rot_packed: u32) -> array<f32, 6> {
    let qw = (f32(rot_packed        & 0xFFu) - 128.0) / 128.0;
    let qx = (f32((rot_packed >> 8u) & 0xFFu) - 128.0) / 128.0;
    let qy = (f32((rot_packed >>16u) & 0xFFu) - 128.0) / 128.0;
    let qz = (f32((rot_packed >>24u) & 0xFFu) - 128.0) / 128.0;
    let q  = vec4<f32>(qw, qx, qy, qz);

    let q_len_sq = dot(q, q);
    let quat = select(q / sqrt(q_len_sq), vec4<f32>(1.0, 0.0, 0.0, 0.0), q_len_sq < 1e-12);

    let r = quat.x;
    let x = quat.y;
    let y = quat.z;
    let z = quat.w;

    let R = mat3x3<f32>(
        1.0 - 2.0 * (y * y + z * z), 2.0 * (x * y + r * z),       2.0 * (x * z - r * y),
        2.0 * (x * y - r * z),       1.0 - 2.0 * (x * x + z * z), 2.0 * (y * z + r * x),
        2.0 * (x * z + r * y),       2.0 * (y * z - r * x),       1.0 - 2.0 * (x * x + y * y)
    );

    let modifier = uniforms.scale_modifier;
    let raw_s = max(scale * modifier, vec3<f32>(1e-6));
    let max_s = max(raw_s.x, max(raw_s.y, raw_s.z));
    let min_s = max(1e-5, max_s / 25.0);
    let s = clamp(raw_s, vec3<f32>(min_s), vec3<f32>(max_s));

    let L = mat3x3<f32>(
        R[0] * s.x,
        R[1] * s.y,
        R[2] * s.z
    );
    let Sigma = L * transpose(L);

    return array<f32,6>(
        Sigma[0][0], Sigma[0][1], Sigma[0][2],
        Sigma[1][1], Sigma[1][2], Sigma[2][2],
    );
}

fn compute_cov2d(cam_pos: vec4<f32>, scale: vec3<f32>, rot_packed: u32) -> vec4<f32> {
    let cov3d = compute_cov3d(scale, rot_packed);
    var t = cam_pos;

    let focal_x = uniforms.focal_x;
    let focal_y = uniforms.focal_y;

    let limx = 1.3 * uniforms.tan_fovx;
    let limy = 1.3 * uniforms.tan_fovy;
    let txtz = t.x / t.z;
    let tytz = t.y / t.z;
    t.x = min(limx, max(-limx, txtz)) * t.z;
    t.y = min(limy, max(-limy, tytz)) * t.z;

    let tz = min(t.z, -1e-4);

    let J00 = focal_x / tz;
    let J11 = focal_y / tz;
    let J20 = 1.0 * -(focal_x * t.x) / (tz * tz);
    let J21 = 1.0 * -(focal_y * t.y) / (tz * tz);

    let W0 = vec3<f32>(uniforms.viewMatrix[0].x, uniforms.viewMatrix[1].x, uniforms.viewMatrix[2].x);
    let W1 = vec3<f32>(uniforms.viewMatrix[0].y, uniforms.viewMatrix[1].y, uniforms.viewMatrix[2].y);
    let W2 = vec3<f32>(uniforms.viewMatrix[0].z, uniforms.viewMatrix[1].z, uniforms.viewMatrix[2].z);

    let T0 = W0 * J00 + W2 * J20;
    let T1 = W1 * J11 + W2 * J21;

    let V00 = cov3d[0];
    let V01 = cov3d[1];
    let V02 = cov3d[2];
    let V11 = cov3d[3];
    let V12 = cov3d[4];
    let V22 = cov3d[5];

    let vt0 = vec3<f32>(
        V00 * T0.x + V01 * T0.y + V02 * T0.z,
        V01 * T0.x + V11 * T0.y + V12 * T0.z,
        V02 * T0.x + V12 * T0.y + V22 * T0.z
    );

    let vt1 = vec3<f32>(
        V00 * T1.x + V01 * T1.y + V02 * T1.z,
        V01 * T1.x + V11 * T1.y + V12 * T1.z,
        V02 * T1.x + V12 * T1.y + V22 * T1.z
    );

    let cov_x = dot(T0, vt0);
    let cov_y = dot(T0, vt1);
    let cov_z = dot(T1, vt1);

    let det_before = max(1e-6, cov_x * cov_z - cov_y * cov_y);
    let lpf = 0.3;
    let cov_x_lpf = cov_x + lpf;
    let cov_z_lpf = cov_z + lpf;
    let det_after = max(1e-6, cov_x_lpf * cov_z_lpf - cov_y * cov_y);
    let compensation = sqrt(det_before / det_after);

    return vec4<f32>(cov_x_lpf, cov_y, cov_z_lpf, compensation);
}

@vertex
fn vs_id(
    @builtin(vertex_index)   vid      : u32,
    @builtin(instance_index) inst_idx : u32,
) -> VSOut {
    var out : VSOut;
    out.opacity = 0.0;
    out.gauss_idx = inst_idx;

    let g = splat_data[inst_idx];
    let position = vec3<f32>(g.pos_x, g.pos_y, g.pos_z);
    let scale    = vec3<f32>(g.scale_x, g.scale_y, g.scale_z);
    let packed_color = g.color_rgba;
    let opa = f32((packed_color >> 24u) & 0xFFu) / 255.0;

    if opa < uniforms.opacity_threshold { return out; }

    let cam_pos = uniforms.viewMatrix * vec4<f32>(position, 1.0);
    if cam_pos.z > -0.01 { return out; }

    let p_hom = uniforms.projMatrix * cam_pos;
    let p_w = 1.0 / (p_hom.w + 1e-7);
    let ndc = p_hom.xyz * p_w;
    if ndc.x < -2.0 || ndc.x > 2.0 || ndc.y < -2.0 || ndc.y > 2.0 { return out; }

    let cov2d_res = compute_cov2d(cam_pos, scale, g.rot_quat);
    let cov2d = cov2d_res.xyz;
    let det = cov2d.x * cov2d.z - cov2d.y * cov2d.y;
    if det <= 0.0 { return out; }

    let mid = 0.5 * (cov2d.x + cov2d.z);
    let diff = 0.5 * (cov2d.x - cov2d.z);
    let term = sqrt(max(1e-8, diff * diff + cov2d.y * cov2d.y));
    let lambda1 = mid + term;
    let lambda2 = mid - term;
    if lambda2 <= 0.0 { return out; }

    var v1 = vec2<f32>(lambda1 - cov2d.z, cov2d.y);
    if length(v1) < 1e-8 { v1 = vec2<f32>(1.0, 0.0); }
    let v1_dir = normalize(v1);
    let v2_dir = vec2<f32>(-v1_dir.y, v1_dir.x);

    let lambda2_clamped = max(max(lambda2, lambda1 / 25.0), 0.2);
    let cov_clamped = vec3<f32>(
        (lambda1 - lambda2_clamped) * v1_dir.x * v1_dir.x + lambda2_clamped,
        (lambda1 - lambda2_clamped) * v1_dir.x * v1_dir.y,
        (lambda1 - lambda2_clamped) * v1_dir.y * v1_dir.y + lambda2_clamped
    );
    let det_clamped = cov_clamped.x * cov_clamped.z - cov_clamped.y * cov_clamped.y;
    let inv_det = 1.0 / det_clamped;

    let length_major = 2.82842712 * sqrt(lambda1);
    let length_minor = 2.82842712 * sqrt(lambda2_clamped);

    let sw = f32(uniforms.screen_size.x);
    let sh = f32(uniforms.screen_size.y);

    let corner = QUAD_CORNERS[vid];
    let offset_px = (corner.x * length_major * v1_dir) + (corner.y * length_minor * v2_dir);
    let ndc_offset = vec2<f32>(offset_px.x / sw * 2.0, -offset_px.y / sh * 2.0);

    out.position = vec4<f32>(ndc.xy + ndc_offset, ndc.z, 1.0);
    out.uv = offset_px;
    out.conic = vec3<f32>(cov_clamped.z * inv_det, -cov_clamped.y * inv_det, cov_clamped.x * inv_det);
    out.opacity = opa;
    return out;
}

@fragment
fn fs_id(in: VSOut) -> @location(0) vec4<f32> {
    let u = in.uv.x;
    let v = in.uv.y;
    let power = -0.5 * (in.conic.x * u*u + in.conic.z * v*v) + in.conic.y * u*v;
    if power < -2.0 { discard; }

    let alpha = min(0.99, in.opacity * exp(power));
    if alpha < uniforms.opacity_threshold { discard; }

    // Encode stable source Gaussian ID (gauss_idx + 1) into RGBA8 bytes
    let id = in.gauss_idx + 1u;
    let r = f32((id >>  0u) & 0xFFu) / 255.0;
    let g = f32((id >>  8u) & 0xFFu) / 255.0;
    let b = f32((id >> 16u) & 0xFFu) / 255.0;
    let a = f32((id >> 24u) & 0xFFu) / 255.0;

    return vec4<f32>(r, g, b, a);
}
`});e.getCompilationInfo().then(e=>{for(let t of e.messages)t.type===`error`&&console.error(`[GaussianIdPass] WGSL Error: ${t.message} at line ${t.lineNum}:${t.linePos}`)}),this.bindGroupLayout=this.device.createBindGroupLayout({entries:[{binding:0,visibility:m.VERTEX|m.FRAGMENT,buffer:{type:`uniform`}},{binding:1,visibility:m.VERTEX,buffer:{type:`read-only-storage`}}]});let t=this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]});this.pipeline=this.device.createRenderPipeline({layout:t,vertex:{module:e,entryPoint:`vs_id`},fragment:{module:e,entryPoint:`fs_id`,targets:[{format:`rgba8unorm`}]},primitive:{topology:`triangle-list`},depthStencil:{format:`depth24plus`,depthWriteEnabled:!0,depthCompare:`less`}})}async renderIdPass(e,t=1024,n=768){if(!this.splatBuffer||this.splatCount===0||!this.pipeline||!this.bindGroupLayout)throw Error(`[GaussianIdPass] Cannot render ID pass: splat data not loaded or pipeline uninitialized.`);let r=performance.now(),{viewMatrix:i,projMatrix:a,cameraPos:o}=this.computeMatrices(e,t,n),s=t/Math.max(1,n),c=Math.tan(e.fovY*.5),l=c*s,u=n/(2*c),d=t/(2*l),f=new ArrayBuffer(176),m=new Float32Array(f),_=new Uint32Array(f);m.set(i,0),m.set(a,16),m.set(o,32),m[35]=l,m[36]=c,m[37]=d,m[38]=u,m[39]=e.scaleModifier||1,_[40]=t,_[41]=n,m[42]=e.opacityThreshold||.03,m[43]=0;let v=this.device.createBuffer({size:f.byteLength,usage:p.UNIFORM|p.COPY_DST});this.device.queue.writeBuffer(v,0,f);let y=this.device.createTexture({size:[t,n],format:`rgba8unorm`,usage:h.RENDER_ATTACHMENT|h.COPY_SRC}),b=this.device.createTexture({size:[t,n],format:`depth24plus`,usage:h.RENDER_ATTACHMENT}),x=Math.ceil(t*4/256)*256,S=x*n,C=this.device.createBuffer({size:S,usage:p.COPY_DST|p.MAP_READ}),w=this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:this.splatBuffer}}]}),T=this.device.createCommandEncoder(),E=T.beginRenderPass({colorAttachments:[{view:y.createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:`clear`,storeOp:`store`}],depthStencilAttachment:{view:b.createView(),depthClearValue:1,depthLoadOp:`clear`,depthStoreOp:`store`}});E.setPipeline(this.pipeline),E.setBindGroup(0,w),E.draw(6,this.splatCount,0,0),E.end(),T.copyTextureToBuffer({texture:y},{buffer:C,bytesPerRow:x,rowsPerImage:n},[t,n,1]),this.device.queue.submit([T.finish()]),await C.mapAsync(g.READ);let D=new Uint8Array(C.getMappedRange().slice(0));C.unmap(),y.destroy(),b.destroy(),v.destroy(),C.destroy();let O=0;for(let e=0;e<D.length;e+=4)(D[e]!==0||D[e+1]!==0||D[e+2]!==0||D[e+3]!==0)&&O++;let k=performance.now()-r;return console.log(`[GaussianIdPass] Rendered ID buffer (${t}x${n}) in ${k.toFixed(1)}ms. Non-zero ID pixels: ${O}`),{width:t,height:n,getPixelId:(e,r)=>{if(e<0||e>=t||r<0||r>=n)return null;let i=r*x+e*4,a=D[i+0],o=D[i+1],s=D[i+2],c=D[i+3],l=a|o<<8|s<<16|c<<24;return l===0?null:l-1},rawBuffer:D,bytesPerRow:x}}computeMatrices(e,t,n){let{yaw:r,pitch:i,distance:a,target:o,fovY:s}=e,c=t/Math.max(1,n),l=Math.cos(i),u=Math.sin(i),d=Math.cos(r),f=Math.sin(r),p=[o[0]+a*l*f,o[1]+a*u,o[2]+a*l*d],m=[0,-1,0],h=o[0]-p[0],g=o[1]-p[1],_=o[2]-p[2],v=Math.sqrt(h*h+g*g+_*_)||1e-8;h/=v,g/=v,_/=v;let y=g*m[2]-_*m[1],b=_*m[0]-h*m[2],x=h*m[1]-g*m[0],S=Math.sqrt(y*y+b*b+x*x)||1e-8;y/=S,b/=S,x/=S;let C=b*_-x*g,w=x*h-y*_,T=y*g-b*h,E=new Float32Array(16);E[0]=y,E[1]=C,E[2]=-h,E[3]=0,E[4]=b,E[5]=w,E[6]=-g,E[7]=0,E[8]=x,E[9]=T,E[10]=-_,E[11]=0,E[12]=-(y*p[0]+b*p[1]+x*p[2]),E[13]=-(C*p[0]+w*p[1]+T*p[2]),E[14]=h*p[0]+g*p[1]+_*p[2],E[15]=1;let D=.1,O=1/Math.tan(s*.5),k=1/(D-100),A=new Float32Array(16);return A[0]=O/c,A[5]=O,A[10]=100*k,A[11]=-1,A[14]=100*D*k,{viewMatrix:E,projMatrix:A,cameraPos:p}}},v=class{wasm;config;lastResult=null;lastInitialSamSeeds=[];lastActiveSelection=new Set;refinementIteration=0;completionStageIndex=0;hasSamMask=!1;constructor(e,t={}){this.wasm=e,this.config={...r,...t}}getConfig(){return{...this.config}}updateConfig(e){this.config={...this.config,...e}}resetState(){this.lastActiveSelection.clear(),this.lastInitialSamSeeds=[],this.lastResult=null,this.refinementIteration=0,this.completionStageIndex=0,this.hasSamMask=!1,this.config.useMultiViewConstraint=!1,this.wasm.clearSamMask?.(),console.log(`[SelectionRefinementService] State reset: cleared SAM mask, iteration history, and progressive stage.`)}resetProgression(){this.refinementIteration=0,this.completionStageIndex=0,this.lastResult=null,this.lastInitialSamSeeds.length>0&&(this.lastActiveSelection=new Set(this.lastInitialSamSeeds))}setInitialSamSeeds(e){this.lastInitialSamSeeds=[...e],this.lastActiveSelection=new Set(e),this.refinementIteration=0,this.completionStageIndex=0,this.lastResult=null,this.hasSamMask=!0,this.config.useMultiViewConstraint=!1}getInitialSamSeeds(){return[...this.lastInitialSamSeeds]}setHasSamMask(e){this.hasSamMask=e}isSamMaskAvailable(){return this.hasSamMask&&(this.wasm.hasSamMask?this.wasm.hasSamMask():!0)}getLastResult(){return this.lastResult}trackSelectionChange(e){let t=new Set(e);if(t.size===0){this.lastActiveSelection.clear();return}this.lastActiveSelection=t}refineSelection(e,t){let n=t?{...this.config,...t}:this.config;if(!n.enabled){console.log(`[SelectionRefinementService] Refinement is disabled; using unrefined selection.`),this.wasm.setSelectedIndices(e);let t={selectedIds:e,newlyAddedIds:[],diagnostics:{samSeedCount:e.length,initialFrontierSize:0,newlyAddedCount:0,finalSelectedCount:e.length,spatialIndexBuildMs:0,propagationMs:0,totalRefinementMs:0}};return this.lastResult=t,this.lastActiveSelection=new Set(e),t}let r=this.wasm.refineSelection(e,n);return this.lastResult=r,this.lastActiveSelection=new Set(r.selectedIds),this.logDiagnostics(r.diagnostics),r}refineCurrentSelection(e){let t=this.wasm.getSelectedIndices();if(t.length===0)return console.warn(`[SelectionRefinementService] Cannot refine: current selection is empty.`),{selectedIds:[],newlyAddedIds:[],diagnostics:{samSeedCount:0,initialFrontierSize:0,newlyAddedCount:0,finalSelectedCount:0,spatialIndexBuildMs:0,propagationMs:0,totalRefinementMs:0}};this.refinementIteration++,console.log(`[SelectionRefinementService] [Iteration ${this.refinementIteration}] Refining current selection: ${t.length} active seeds (SAM constraint: ${!!this.config.useMultiViewConstraint}).`);let n=this.refineSelection(t,e),r=this.config.useMultiViewConstraint?a:i;if(n.newlyAddedIds.length===0&&(!e||Object.keys(e).length===0)){let e=Math.min(this.completionStageIndex+1,r.length-1);if(e>this.completionStageIndex){console.log(`[SelectionRefinementService] Frontier stalled; advancing to ${r[e].name}...`),this.completionStageIndex=e;let i=r[e].config;n=this.refineSelection(t,i)}}return n}refineToCompletion(e=8,t){let n=this.config.useMultiViewConstraint&&this.lastInitialSamSeeds.length>0?[...this.lastInitialSamSeeds]:this.wasm.getSelectedIndices();if(n.length===0)return this.refineCurrentSelection(t);let r=this.config.useMultiViewConstraint?a:i,o=new Set,s=this.completionStageIndex;s>=r.length&&(s=Math.max(0,r.length-1));let c=0,l=null;for(console.log(`[SelectionRefinementService] Auto-Refine To Completion: starting from ${n.length} seeds (stage ${s}, SAM constraint: ${!!this.config.useMultiViewConstraint})...`);c<e&&s<r.length;){let e=r[s],i=t?{...e.config,...t}:e.config;this.refinementIteration++,console.log(`[SelectionRefinementService] Pass ${c+1} (${e.name}): seeds=${n.length}`);let a=this.refineSelection(n,i);c++,l=a;for(let e of a.newlyAddedIds)o.add(e);if(a.diagnostics.runawayTriggered){console.warn(`[SelectionRefinementService] Runaway safety triggered during ${e.name}. Halting.`);break}n=this.wasm.getSelectedIndices(),s++}this.completionStageIndex=Math.min(s,r.length);let u=this.wasm.getSelectedIndices(),d=Array.from(o),f={selectedIds:u,newlyAddedIds:d,diagnostics:{samSeedCount:this.lastInitialSamSeeds.length>0?this.lastInitialSamSeeds.length:u.length-d.length,initialFrontierSize:l?.diagnostics.initialFrontierSize??0,newlyAddedCount:d.length,finalSelectedCount:u.length,iterationCount:c,runawayTriggered:l?.diagnostics.runawayTriggered??0,spatialIndexBuildMs:l?.diagnostics.spatialIndexBuildMs??0,propagationMs:l?.diagnostics.propagationMs??0,totalRefinementMs:l?.diagnostics.totalRefinementMs??0,warningMessage:l?.diagnostics.warningMessage}};return this.lastResult=f,this.lastActiveSelection=new Set(u),console.log(`[SelectionRefinementService] Auto-Refine To Completion done: +${d.length} Gaussians added across ${c} passes (${u.length} total).`),f}logDiagnostics(e){console.log(`=========================================`),console.log(`[GaussianRefinement] Iteration ${this.refinementIteration} Telemetry Report`),console.log(`-----------------------------------------`),console.log(`Active seeds          : ${e.samSeedCount}`),console.log(`Initial frontier size : ${e.initialFrontierSize}`),console.log(`Iterations run        : ${e.iterationCount??1}`),console.log(`Added by refinement   : +${e.newlyAddedCount}`),console.log(`Final selection       : ${e.finalSelectedCount}`),e.runawayTriggered&&console.warn(`[GaussianRefinement] Runaway safety trigger fired!`),console.log(``),console.log(`Spatial index build   : ${e.spatialIndexBuildMs.toFixed(1)} ms`),console.log(`Expansion pass        : ${e.propagationMs.toFixed(1)} ms`),console.log(`Total refinement      : ${e.totalRefinementMs.toFixed(1)} ms`),e.warningMessage&&console.warn(`[GaussianRefinement Warning] ${e.warningMessage}`),this.config.useMultiViewConstraint&&e.candidatesEvaluated!==void 0&&(console.log(`-----------------------------------------`),console.log(`[Refinement Verification]`),console.log(`  Initial seeds:              ${e.samSeedCount}`),console.log(`  Candidates evaluated:       ${e.candidatesEvaluated}`),console.log(`  Geometry rejected:          ${e.rejectedByGeometry??0}`),console.log(`  Multi-view negative veto:   ${e.rejectedByNegativeVeto??0}`),console.log(`  Insufficient view support:  ${e.rejectedByInsufficientSupport??0}`),console.log(`  Depth/visibility uncertain: ${e.uncertainVisibilityOrDepth??0}`),console.log(`  Accepted >=2 views:         ${e.acceptedMultiView??0}`),console.log(`  Accepted single observable: ${e.acceptedSingleObservable??0}`),console.log(`  Final selection:            ${e.finalSelectedCount}`)),console.log(`=========================================`)}},y=class{wasm;idPass;refinementService;minViewSupport;comprehensiveCoverage=!1;constructor(e,t,n,r=1){this.wasm=e,this.idPass=t,this.refinementService=n,this.minViewSupport=r,this.wasm.setSemanticCoverageMode(this.comprehensiveCoverage)}setComprehensiveCoverage(e){this.comprehensiveCoverage=e,this.wasm.setSemanticCoverageMode(e)}isComprehensiveCoverage(){return this.comprehensiveCoverage}setRefinementService(e){this.refinementService=e}getRefinementService(){return this.refinementService}setMinViewSupport(e){this.minViewSupport=Math.max(1,e)}async processSelection(e,t,n=0){let r=performance.now(),i=0,a=0,o=0,s=0,c=0,l=0,u={},d={};this.wasm.setSemanticCoverageMode(this.comprehensiveCoverage);let f=this.comprehensiveCoverage?1:e.length>=2?Math.min(2,this.minViewSupport):1;console.log(`[SemanticSelection] Starting multi-view Gaussian ID mapping for ${e.length} segmented views (mode=${this.comprehensiveCoverage?`Comprehensive`:`Conservative`}, min_support=${f})...`),this.wasm.clearSamMask?.(),this.refinementService&&(this.refinementService.resetState(),this.refinementService.updateConfig({useMultiViewConstraint:!1})),this.wasm.resetSemanticUplifter();for(let n of e){let e=n.view_id,r=t.get(e);if(!r){console.warn(`[SemanticSelection] View '${e}' not found in activeCapturedViews metadata.`);continue}let l=performance.now(),{maskData:d,maskWidth:f,maskHeight:p}=await this.decodePngMask(n.mask_png_base64);i+=performance.now()-l;let m=r.metadata.camera_metadata||{},h=this.wasm.getCameraState(),g={yaw:m.yaw??h.yaw,pitch:m.pitch??h.pitch,distance:m.distance??h.distance,target:m.target||h.target,fovY:m.fov_y||1.0471975,aspect:f/Math.max(1,p),scaleModifier:1,opacityThreshold:.03},_=performance.now(),v=await this.idPass.renderIdPass(g,f,p);a+=performance.now()-_;let y=performance.now();try{let t=this.wasm.processMaskView(d,f,p,v.rawBuffer,v.bytesPerRow,g);o+=performance.now()-y,s+=t.filteredPixels,c+=t.filteredDepth,u[e]=t.candidateCount,console.log(`[SemanticSelection] View '${e}' (C++ Uplifter): ${t.candidateCount} candidate Gaussian IDs (filtered ${t.filteredPixels} pixel-strays, ${t.filteredDepth} depth-spills, ${t.uniqueGaussians} unique Gaussians).`)}catch(t){console.warn(`[SemanticSelection] C++ processMaskView encountered an error on view '${e}':`,t)}}let p=performance.now(),m=[];try{let e=this.wasm.computeConsensusSeeds(f);m=e.candidateSeeds,l+=e.filteredOutliers}catch(e){console.warn(`[SemanticSelection] C++ computeConsensusSeeds encountered an error:`,e)}let h=performance.now()-p,g=[...m];this.refinementService&&(this.refinementService.setInitialSamSeeds(g),this.refinementService.setHasSamMask(!0)),console.log(`[SemanticSelection] Uploading ${g.length} initial SAM-selected Gaussian IDs to GauSSCol.`),this.wasm.setSelectedIndices(g);let _=g,v=performance.now()-r;for(let t of e)d[t.view_id]=0;let y={geminiMs:Math.round(n),samPerViewMs:d,samTotalMs:0,maskDecodeMs:Math.round(i),webgpuIdPassMs:Math.round(a),mappingMs:Math.round(o),mergeMs:Math.round(h),refinementMs:0,totalMs:Math.round(v+n),selectedCount:_.length,samSeedCount:g.length,newlyRefinedCount:0,refinementDiagnostics:void 0,viewCandidates:u,filteredPixelCount:s,filteredDepthCount:c,filteredOutliersCount:l};return this.logTimingSummary(y),{selectedIndices:_,timing:y}}decodePngMask(e){return new Promise((t,n)=>{let r=new Image;r.crossOrigin=`anonymous`,r.onload=()=>{let e=r.naturalWidth||r.width,i=r.naturalHeight||r.height,a=document.createElement(`canvas`);a.width=e,a.height=i;let o=a.getContext(`2d`,{willReadFrequently:!0});if(!o){n(Error(`Failed to acquire 2D canvas context for mask decoding.`));return}o.drawImage(r,0,0);let s=o.getImageData(0,0,e,i).data,c=new Uint8Array(e*i);for(let e=0;e<c.length;e++)c[e]=s[e*4];t({maskData:c,maskWidth:e,maskHeight:i})},r.onerror=e=>n(Error(`Failed to load PNG mask image: ${e}`)),r.src=e})}logTimingSummary(e){console.log(`=========================================`),console.log(`Semantic Selection Timing Breakdown`),console.log(`-----------------------------------------`),console.log(`Gemini grounding:       ${e.geminiMs} ms`);for(let[t,n]of Object.entries(e.viewCandidates))console.log(`View '${t}' candidates:  ${n}`);console.log(`Mask decode:            ${e.maskDecodeMs} ms`),console.log(`Gaussian ID rendering:  ${e.webgpuIdPassMs} ms`),console.log(`Mask→Gaussian mapping:  ${e.mappingMs} ms`),console.log(`Consensus merge:        ${e.mergeMs} ms`),e.refinementMs!==void 0&&e.refinementMs>0&&console.log(`Browser Refinement:     ${e.refinementMs} ms (+${e.newlyRefinedCount??0} added)`),console.log(`Spillover Filtered:     ${e.filteredPixelCount} pixel-strays, ${e.filteredDepthCount} depth-spills, ${e.filteredOutliersCount} outliers`),console.log(`-----------------------------------------`),console.log(`Selected Gaussians:     ${e.selectedCount} (SAM seeds: ${e.samSeedCount??e.selectedCount})`),console.log(`Total Pipeline Time:    ${e.totalMs} ms`),console.log(`=========================================`)}};function b(e){return e.innerHTML=`
        <div style="position: relative; width: 100vw; height: 100vh; background: #0f1217; overflow: hidden; user-select: none;">
            <canvas id="canvas" style="width: 100%; height: 100%; display: block;"></canvas>

            <!-- Loading Indicator Overlay -->
            <div id="loading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; background: rgba(0,0,0,0.85); padding: 25px; border-radius: 12px; font-family: 'Outfit', sans-serif; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); z-index: 200;">
                <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px; color: #818cf8;">GauSSCol.SI</div>
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
            <input type="file" id="file-input" accept=".splat,.ply,.glb,.gltf,.stl" style="display: none;" />
        </div>
    `,{rootContainer:e.querySelector(`div`),canvas:document.getElementById(`canvas`),loadingContainer:document.getElementById(`loading`),statusText:document.getElementById(`status-text`),fpsDisplay:document.getElementById(`fps-display`),fileInput:document.getElementById(`file-input`)}}function x(e){return`./`+(e.startsWith(`/`)?e.substring(1):e)}var S=class e{static async initialize(t){if(!navigator.gpu)return alert(`WebGPU is not supported in this browser. Please use Chrome, Edge, or a Chromium browser with WebGPU enabled.`),null;let n=await navigator.gpu.requestAdapter();if(!n)return alert(`No appropriate WebGPU adapter found.`),null;let r=await n.requestDevice();return r.lost.then(e=>{console.error(`WebGPU Device Lost: ${e.message} (Reason: ${e.reason})`)}),t(`Loading Emscripten WASM module...`),{device:r,wasmModule:await e.loadWasmScript(r)}}static loadWasmScript(e){return new Promise((t,n)=>{let r=document.createElement(`script`);r.src=x(`splat_renderer.js?t=`+Date.now()),document.head.appendChild(r),r.onload=async()=>{try{let n=window.createSplatRenderer;t(await n({preinitializedWebGPUDevice:e,locateFile:e=>e.endsWith(`.wasm`)?x(e+`?t=`+Date.now()):e}))}catch(e){n(e)}},r.onerror=e=>n(Error(`Failed to load splat_renderer.js: ${e}`))})}},C=class{wasm;refinementService;sidePanel;constructor(e,t){this.wasm=e,this.refinementService=t}setSidePanel(e){this.sidePanel=e}updateSelectionCount(){let e=this.wasm.getSelectionCount(),t=this.wasm.getSelectedIndices();this.refinementService.trackSelectionChange(t);let n=this.refinementService.isSamMaskAvailable();this.sidePanel?.updateSelectionCount(e,n)}clearSelection(){this.refinementService.resetState(),this.sidePanel?.setRefinementStatus(null),this.wasm.clearSelection(),this.updateSelectionCount()}deleteSelected(){this.wasm.deleteSelected(),this.updateSelectionCount()}refineStep(){if(this.wasm.getSelectionCount()===0){alert(`No splats currently selected to refine. Please select an initial region first.`);return}try{this.sidePanel.setRefinementStatus(`Refining selection...`,!0);let e=this.refinementService.refineCurrentSelection();this.updateSelectionCount();let t=e.newlyAddedIds.length,n=e.diagnostics;t>0?this.sidePanel.setRefinementStatus(`+${t} Gaussians (${n.finalSelectedCount} total, ${n.totalRefinementMs.toFixed(1)}ms)`,!1):this.sidePanel.setRefinementStatus(`Boundary reached (${n.finalSelectedCount} Gaussians total)`,!1)}catch(e){console.error(`Refinement step failed:`,e),this.sidePanel.setRefinementStatus(`Refinement error: ${e.message}`,!1)}}refineToCompletion(){if(this.wasm.getSelectionCount()===0){alert(`No splats currently selected to refine. Please select an initial region first.`);return}try{this.sidePanel.setRefinementStatus(`Refining to complete object...`,!0);let e=this.refinementService.refineToCompletion(8);this.updateSelectionCount();let t=e.newlyAddedIds.length,n=e.diagnostics;t>0?this.sidePanel.setRefinementStatus(`✨ Object refined: +${t} Gaussians (${n.finalSelectedCount} total)`,!1):this.sidePanel.setRefinementStatus(`✨ Entire object covered (${n.finalSelectedCount} Gaussians total)`,!1)}catch(e){console.error(`Refinement to completion failed:`,e),this.sidePanel.setRefinementStatus(`Refinement error: ${e.message}`,!1)}}updateRefinementConfig(e){let t=this.refinementService.getConfig().useMultiViewConstraint;if(this.refinementService.updateConfig(e),!t&&e.useMultiViewConstraint){let e=this.refinementService.getInitialSamSeeds();e.length>0&&(console.log(`[SelectionController] Option B checked: resetting to original ${e.length} SAM seeds.`),this.refinementService.resetProgression(),this.wasm.setSelectedIndices(e),this.updateSelectionCount(),this.sidePanel?.setRefinementStatus(`Option B active: reset to original SAM seeds`,!1))}}},w=class{wasm;gaussianIdPass;sidePanel;refinementService;loadingContainerEl;statusTextEl;canvas;callbacks;constructor(e,t,n,r,i,a,o,s){this.wasm=e,this.gaussianIdPass=t,this.sidePanel=n,this.refinementService=r,this.loadingContainerEl=i,this.statusTextEl=a,this.canvas=o,this.callbacks=s}async loadLocalFile(e){this.showLoading(`Loading ${e.name}...`),this.refinementService.resetState(),this.sidePanel.setRefinementStatus(null);let t=e.name.substring(e.name.lastIndexOf(`.`)).toLowerCase(),n=[`.glb`,`.gltf`,`.stl`].includes(t);try{n?await this.loadLocalMesh(e,t):await this.loadLocalGaussian(e)}catch(e){console.error(`Failed to load local file:`,e),alert(`Failed to load file: ${e.message}`)}finally{this.hideLoading()}}async loadDemoRoom(){this.showLoading(`Downloading demo scene (room-7k.splat)...`);try{let e=x(`room-7k.splat`),t=await fetch(e);if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let n=t.headers.get(`content-length`),r=n?parseInt(n,10):0,i;if(r===0||!t.body)i=await t.arrayBuffer();else{let e=t.body.getReader(),n=0,a=[];for(;;){let{done:t,value:i}=await e.read();if(t)break;a.push(i),n+=i.length;let o=r?Math.round(n/r*100):0,s=(n/(1024*1024)).toFixed(1);this.updateStatus(`Downloading room demo: ${s}MB (${o}%)`)}this.updateStatus(`Processing splat data in WebAssembly...`);let o=new Uint8Array(n),s=0;for(let e of a)o.set(e,s),s+=e.length;i=o.buffer}this.wasm.loadSplatData(i),this.wasm.setSplatBuffer(i),this.gaussianIdPass.setSplatBuffer(i),this.sidePanel.setSceneType(`gaussian`),this.sidePanel.setMeshInfo(null),this.wasm.cameraReset(),this.wasm.cameraZoom(-.75),this.wasm.setGridEnabled(!1),this.sidePanel.setGridEnabled(!1),this.refinementService.resetState(),this.sidePanel.setRefinementStatus(null),this.callbacks.onSceneReset(),this.callbacks.updateSelectionCount()}catch(e){console.error(`Failed to load demo room:`,e),alert(`Failed to load demo: ${e.message}`)}finally{this.hideLoading()}}async loadDemoMesh(e){let t=e.split(`/`).pop()||e;this.showLoading(`Downloading demo mesh (${t})...`);try{let n=x(e),r=await fetch(n);if(!r.ok)throw Error(`HTTP error! status: ${r.status}`);let i=await r.arrayBuffer(),a=t.toLowerCase().endsWith(`.stl`)?`stl`:`glb`;if(!this.wasm.loadMeshData(i,a))throw Error(`Could not parse mesh ${t}`);let o=this.wasm.getMeshInfo();this.sidePanel.setSceneType(`mesh`),this.sidePanel.setMeshInfo({filename:t,vertexCount:o.vertexCount,triangleCount:o.triangleCount,materialCount:o.materialCount,textureCount:o.textureCount}),this.callbacks.onSceneReset(),this.callbacks.updateSelectionCount()}catch(e){console.error(`Failed to load demo mesh:`,e),alert(`Failed to load demo mesh: ${e.message}`)}finally{this.hideLoading()}}async loadLocalMesh(e,t){this.updateStatus(`Parsing 3D mesh ${e.name}...`);let n=await e.arrayBuffer(),r=t.replace(`.`,``);if(!this.wasm.loadMeshData(n,r))throw Error(`Could not parse mesh ${e.name}`);let i=this.wasm.getMeshInfo();this.sidePanel.setSceneType(`mesh`),this.sidePanel.setMeshInfo({filename:e.name,vertexCount:i.vertexCount,triangleCount:i.triangleCount,materialCount:i.materialCount,textureCount:i.textureCount}),this.callbacks.onSceneReset(),this.callbacks.updateSelectionCount()}async loadLocalGaussian(e){this.sidePanel.setSceneType(`gaussian`),this.sidePanel.setMeshInfo(null),this.updateStatus(`Processing ${e.name} in WebAssembly...`);let t=await e.arrayBuffer();this.wasm.loadSplatData(t);let n=this.wasm.getSplatBuffer()||t;this.wasm.setSplatBuffer(n),this.gaussianIdPass.setSplatBuffer(n),this.wasm.setCanvasSize(this.canvas.clientWidth||1920,this.canvas.clientHeight||1080),this.callbacks.onSceneReset(),this.callbacks.updateSelectionCount()}showLoading(e){this.loadingContainerEl.style.display=`block`,this.statusTextEl.innerText=e}updateStatus(e){this.statusTextEl.innerText=e}hideLoading(){this.loadingContainerEl.style.display=`none`}},T=class{overlayEl=null;show(e,t=`Capturing scene perspectives...`){this.hide();let n=e.parentElement;if(!n)return;let r=``;try{r=e.toDataURL(`image/jpeg`,.92)}catch(e){console.warn(`[ViewportFreezeOverlay] Canvas toDataURL fallback:`,e)}let i=document.createElement(`div`);if(i.id=`viewport-freeze-overlay`,i.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: 28px;
            overflow: hidden;
            background: #0f172a;
        `,r){let e=document.createElement(`img`);e.src=r,e.style.cssText=`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                pointer-events: none;
            `,i.appendChild(e)}let a=document.createElement(`div`);if(a.id=`viewport-freeze-badge`,a.style.cssText=`
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(15, 23, 42, 0.88);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(56, 189, 248, 0.45);
            color: #f8fafc;
            padding: 8px 18px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);
            letter-spacing: 0.02em;
            animation: fadeIn 0.15s ease-out;
        `,a.innerHTML=`
            <div style="width: 13px; height: 13px; border: 2px solid #38bdf8; border-top-color: transparent; border-radius: 50%; animation: freezeSpin 0.75s linear infinite;"></div>
            <span id="viewport-freeze-text">${t}</span>
        `,!document.getElementById(`freeze-overlay-style`)){let e=document.createElement(`style`);e.id=`freeze-overlay-style`,e.textContent=`
                @keyframes freezeSpin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
            `,document.head.appendChild(e)}i.appendChild(a),n.appendChild(i),this.overlayEl=i}updateMessage(e){let t=this.overlayEl?.querySelector(`#viewport-freeze-text`);t&&(t.textContent=e)}hide(){this.overlayEl&&=(this.overlayEl.remove(),null)}},E=class{static offscreenCanvas=null;static freezeOverlay=new T;static getOffscreenCanvas(e,t){return this.offscreenCanvas||=document.createElement(`canvas`),this.offscreenCanvas.width=e,this.offscreenCanvas.height=t,this.offscreenCanvas}static async captureCanvas(e,t=1024,n=768,r=.85){let i=e.width/Math.max(1,e.height),a=t,o=Math.round(t/i);o>n&&(o=n,a=Math.round(n*i));let s=this.getOffscreenCanvas(a,o);return s.getContext(`2d`).drawImage(e,0,0,e.width,e.height,0,0,a,o),new Promise((e,t)=>{s.toBlob(n=>{if(!n){t(Error(`Canvas toBlob encoding failed`));return}e({blob:n,dataUrl:s.toDataURL(`image/jpeg`,r)})},`image/jpeg`,r)})}static async captureRoiCrop(e,t,n=768,r=.9){let i=Math.max(0,Math.round(t.x_min*e.width)),a=Math.max(0,Math.round(t.y_min*e.height)),o=Math.min(e.width-i,Math.max(10,Math.round((t.x_max-t.x_min)*e.width))),s=Math.min(e.height-a,Math.max(10,Math.round((t.y_max-t.y_min)*e.height))),c=o/s,l=n,u=Math.round(n/c);u>n&&(u=n,l=Math.round(n*c));let d=this.getOffscreenCanvas(l,u),f=d.getContext(`2d`);return f.imageSmoothingEnabled=!0,f.imageSmoothingQuality=`high`,f.drawImage(e,i,a,o,s,0,0,l,u),new Promise((e,t)=>{d.toBlob(n=>{if(!n){t(Error(`ROI crop encoding failed`));return}e({blob:n,dataUrl:d.toDataURL(`image/jpeg`,r)})},`image/jpeg`,r)})}static async captureEntireScene(e,t,n){let r=new Map,i=e.width,a=e.height;t.snapCamera(),t.settleCamera(i,a,n,2);let o=await this.captureCanvas(e),s=t.getCameraState();r.set(`current`,{viewId:`current`,role:`scene_view`,blob:o.blob,dataUrl:o.dataUrl,metadata:{view_id:`current`,role:`scene_view`,camera_metadata:{yaw:s.yaw,pitch:s.pitch,distance:s.distance,target:[...s.target],fov_y:1.0471975}}}),this.freezeOverlay.show(e,`Capturing scene perspectives (12 multi-angle views)...`),t.setCameraDamping(1);try{let o=[{id:`yaw_plus_45`,dy:Math.PI/4,dp:0},{id:`yaw_plus_90`,dy:Math.PI/2,dp:0},{id:`yaw_plus_135`,dy:3*Math.PI/4,dp:0},{id:`opposite_180`,dy:Math.PI,dp:0},{id:`yaw_minus_135`,dy:-3*Math.PI/4,dp:0},{id:`yaw_minus_90`,dy:-Math.PI/2,dp:0},{id:`yaw_minus_45`,dy:-Math.PI/4,dp:0},{id:`top_birds_eye`,dy:0,dp:.95},{id:`elevated_top`,dy:Math.PI/2,dp:.5},{id:`bottom_worms_eye`,dy:0,dp:-.95},{id:`bottom_low_angle`,dy:Math.PI,dp:-.5}];for(let c=0;c<o.length;c++){let l=o[c];this.freezeOverlay.updateMessage(`Capturing viewpoint ${c+2}/12 (${l.id.replace(/_/g,` `)})...`);let u=s.yaw+l.dy,d=Math.max(-1.45,Math.min(1.45,s.pitch+l.dp));t.setCameraState(u,d,s.distance,s.target[0],s.target[1],s.target[2]),t.settleCamera(i,a,n,1);let f=await this.captureCanvas(e),p=t.getCameraState();r.set(l.id,{viewId:l.id,role:`scene_view`,blob:f.blob,dataUrl:f.dataUrl,metadata:{view_id:l.id,role:`scene_view`,camera_metadata:{yaw:p.yaw,pitch:p.pitch,distance:p.distance,target:[...p.target],fov_y:1.0471975}}})}}finally{t.setCameraState(s.yaw,s.pitch,s.distance,s.target[0],s.target[1],s.target[2]),t.settleCamera(i,a,n,1),t.setCameraDamping(.12),this.freezeOverlay.hide()}return r}static async capture3dRoiViews(e,t,n){let r=new Map,i=e.width,a=e.height;t.snapCamera(),t.settleCamera(i,a,n,2);let o=await this.captureCanvas(e),s=t.getCameraState();r.set(`roi_center`,{viewId:`roi_center`,role:`roi_detail`,blob:o.blob,dataUrl:o.dataUrl,metadata:{view_id:`roi_center`,role:`roi_detail`,camera_metadata:{yaw:s.yaw,pitch:s.pitch,distance:s.distance,target:[...s.target],fov_y:1.0471975}}}),this.freezeOverlay.show(e,`Framing 3D ROI multi-angle perspectives...`),t.setCameraDamping(1);try{let o=[{id:`roi_yaw_plus_60`,dy:1.0471975,dp:0},{id:`roi_yaw_minus_60`,dy:-1.0471975,dp:0},{id:`roi_opposite`,dy:3.14159,dp:0},{id:`roi_top_birds_eye`,dy:0,dp:.95},{id:`roi_bottom_worms_eye`,dy:0,dp:-.95},{id:`roi_elevated`,dy:0,dp:.35}];for(let c=0;c<o.length;c++){let l=o[c];this.freezeOverlay.updateMessage(`Framing 3D ROI angle ${c+2}/7 (${l.id.replace(/_/g,` `)})...`);let u=s.yaw+l.dy,d=Math.max(-1.45,Math.min(1.45,s.pitch+l.dp));t.setCameraState(u,d,s.distance,s.target[0],s.target[1],s.target[2]),t.settleCamera(i,a,n,1);let f=await this.captureCanvas(e),p=t.getCameraState();r.set(l.id,{viewId:l.id,role:`roi_detail`,blob:f.blob,dataUrl:f.dataUrl,metadata:{view_id:l.id,role:`roi_detail`,camera_metadata:{yaw:p.yaw,pitch:p.pitch,distance:p.distance,target:[...p.target],fov_y:1.0471975}}})}}finally{t.setCameraState(s.yaw,s.pitch,s.distance,s.target[0],s.target[1],s.target[2]),t.settleCamera(i,a,n,1),t.setCameraDamping(.12),this.freezeOverlay.hide()}return r}},D=class{canvas;wasm;semanticManager;visionClient;bboxOverlay;viewInspector;askVisionPanel=null;activeCapturedViews=new Map;callbacks;constructor(e,t,n,r,i,a,o){this.canvas=e,this.wasm=t,this.semanticManager=n,this.visionClient=r,this.bboxOverlay=i,this.viewInspector=a,this.callbacks=o}setAskVisionPanel(e){this.askVisionPanel=e}async handleRunQuery(e){if(this.askVisionPanel){if((await this.visionClient.checkHealth()).status!==`ok`){this.askVisionPanel.setServerStatus(!1),this.askVisionPanel.setStatus(`Vision service unavailable. Start GauSSCol.SI Vision on port 8010.`,!1);return}try{this.activeCapturedViews.clear(),this.bboxOverlay.clear();let t=new Map,n=[],r=window.devicePixelRatio||1;this.askVisionPanel.setStatus(`Capturing 12 multi-angle scene viewpoints...`,!0);let i=await E.captureEntireScene(this.canvas,this.wasm,r);for(let[e,r]of i.entries())t.set(e,r.blob),this.activeCapturedViews.set(e,r),n.push(r.metadata);this.askVisionPanel.setStatus(`Analyzing scene with Vision backend...`,!0);let a=this.askVisionPanel.getConversationHistory(),o=await this.visionClient.query({question:e,query_scope:`scene`,views:n,conversation_history:a},t);this.askVisionPanel.setResponse(o,this.activeCapturedViews),this.askVisionPanel.addTurn(e,o.answer),this.bboxOverlay.setObservations(o.observations,`current`),o.intent===`SELECT_OBJECT`?await this.handleObjectSelection(o):this.askVisionPanel.setStatus(`Analysis complete`,!1)}catch(e){console.error(`Vision query failed:`,e),this.askVisionPanel.setStatus(`Error: ${e.message}`,!1),alert(`Vision service error: ${e.message}`)}}}async handleObjectSelection(e){if(this.askVisionPanel){if(this.wasm.getSceneType()===`mesh`){let t=e.target?.description||e.target?.label||`object`;this.askVisionPanel.setStatus(`Target "${t}" identified. 3D mesh selection is not supported in V1.`,!1);return}if(e.segmentation?.views&&e.segmentation.views.length>0){this.callbacks.clearRefinementStatus(),this.askVisionPanel.setStatus(`Mapping 2D SAM masks to 3D Gaussian IDs in WebGPU...`,!0);let t=e.metrics?.gemini_ms||0,{selectedIndices:n,timing:r}=await this.semanticManager.processSelection(e.segmentation.views,this.activeCapturedViews,t);this.callbacks.updateSelectionCount(),this.bboxOverlay.clearSamMasks();for(let t of e.segmentation.views)t.mask_png_base64&&this.bboxOverlay.setSamMask(t.mask_png_base64,t.view_id);let i=e.target?.description||e.target?.label||`object`;e.debug_info&&(e.debug_info.selection_timing=r,this.askVisionPanel.render());let a=r.filteredPixelCount||r.filteredDepthCount?` | Filtered ${r.filteredPixelCount} strays & ${r.filteredDepthCount} depth-spills`:``;this.askVisionPanel.setStatus(`Selected "${i}" (${n.length} Gaussians across ${e.segmentation.views.length} views${a} in ${Math.round(r.totalMs)}ms)`,!1)}else this.askVisionPanel.setStatus(`Selection intent recognized, but target object could not be grounded or segmented.`,!1)}}async handleRecommendedView(e,t,n){if(this.askVisionPanel)try{this.askVisionPanel.setStatus(`Transitioning camera to recommended view...`,!0);let r=window.devicePixelRatio||1,i=this.canvas.width,a=this.canvas.height;this.wasm.cameraOrbit(e*Math.PI/180,t*Math.PI/180),n&&n!==1&&this.wasm.cameraZoom(n>1?-.3:.3),this.wasm.settleCamera(i,a,r,35),this.askVisionPanel.setStatus(`Capturing recommended view...`,!0);let o=await E.captureCanvas(this.canvas);this.activeCapturedViews.set(`recommended`,{viewId:`recommended`,role:`recommended`,blob:o.blob,dataUrl:o.dataUrl,metadata:{view_id:`recommended`,role:`recommended`}});let s=new Map;s.set(`recommended`,o.blob);let c=[{view_id:`recommended`,role:`recommended`}];this.askVisionPanel.setStatus(`Refining analysis from recommended viewpoint...`,!0);let l=this.askVisionPanel.getConversationHistory(),u=await this.visionClient.query({question:`Inspect this recommended view for closer verification of previous observations.`,query_scope:`current_view`,views:c,conversation_history:l},s);this.askVisionPanel.setResponse(u,this.activeCapturedViews),this.askVisionPanel.addTurn(`Recommended view inspection`,u.answer),this.askVisionPanel.setStatus(`Refined analysis complete`,!1),this.bboxOverlay.setObservations(u.observations,`recommended`)}catch(e){console.error(`Recommended view inspection failed:`,e),this.askVisionPanel.setStatus(`Refinement failed: ${e.message}`,!1)}}handleShowView(e){let t=this.activeCapturedViews.get(e);if(t){let n=(this.askVisionPanel?.lastResponse)?.observations?.find(t=>t.view_id===e);this.viewInspector.show(t,n)}else e===`current`&&(this.viewInspector.close(),this.bboxOverlay.setActiveView(`current`))}handleClear(){this.bboxOverlay.clear(),this.bboxOverlay.setSamMask(null),this.viewInspector.close(),this.callbacks.clearRefinementStatus(),this.callbacks.clearSelection(),this.callbacks.updateSelectionCount()}resetForNewScene(){this.bboxOverlay.clear(),this.askVisionPanel?.resetConversation(),this.viewInspector.close()}async checkBackendHealth(){await this.retryBackendConnection()}async retryBackendConnection(){this.askVisionPanel?.setIsChecking(!0);try{let e=await this.visionClient.checkHealth();e.status===`ok`?(this.askVisionPanel?.setServerStatus(!0,e.model),this.askVisionPanel?.setStatus(`VLM Ready (${e.model})`,!1)):(this.askVisionPanel?.setServerStatus(!1),this.askVisionPanel?.setStatus(`Vision service unavailable. Start GauSSCol.SI Vision on port 8010.`,!1))}catch{this.askVisionPanel?.setServerStatus(!1),this.askVisionPanel?.setStatus(`Vision service unavailable. Start GauSSCol.SI Vision on port 8010.`,!1)}finally{this.askVisionPanel?.setIsChecking(!1)}}async handleStopServer(){if(confirm(`Are you sure you want to stop the local GauSSCol Vision Server (port 8010)?`)){this.askVisionPanel?.setStatus(`Stopping Vision server...`,!0);try{await this.visionClient.shutdown()}catch(e){console.warn(`Server shutdown triggered:`,e)}setTimeout(()=>{this.askVisionPanel?.setServerStatus(!1),this.askVisionPanel?.setStatus(`Server stopped. Click Setup for instructions to start.`,!1)},800)}}},O=class{canvas;wasm;pointerInput;fpsDisplayEl;isRunning=!1;animFrameId=null;lastTime=0;fpsFrames=0;fpsLastTime=0;constructor(e,t,n,r){this.canvas=e,this.wasm=t,this.pointerInput=n,this.fpsDisplayEl=r}start(){if(this.isRunning)return;this.isRunning=!0,this.lastTime=performance.now(),this.fpsLastTime=performance.now(),this.fpsFrames=0;let e=()=>{if(!this.isRunning)return;let t=performance.now(),n=(t-this.lastTime)/1e3;this.lastTime=t,this.pointerInput.updateContinuous(n);let r=window.devicePixelRatio||1,i=Math.max(100,Math.round(this.canvas.clientWidth*r)),a=Math.max(100,Math.round(this.canvas.clientHeight*r));(this.canvas.width!==i||this.canvas.height!==a)&&(this.canvas.width=i,this.canvas.height=a),this.wasm.updateCamera(),this.wasm.renderFrame(i,a,r),this.updateFpsCounter(t),this.animFrameId=requestAnimationFrame(e)};this.animFrameId=requestAnimationFrame(e)}stop(){this.isRunning=!1,this.animFrameId!==null&&(cancelAnimationFrame(this.animFrameId),this.animFrameId=null)}updateFpsCounter(e){if(this.fpsFrames++,e-this.fpsLastTime>=1e3){let t=Math.round(this.fpsFrames*1e3/(e-this.fpsLastTime));this.fpsDisplayEl.innerText=`FPS: ${t}`,this.fpsFrames=0,this.fpsLastTime=e}}};new class{dom;wasm;gaussianIdPass;refinementService;semanticManager;visionClient;pointerInput;lassoInput;sidePanel;askVisionPanel;bboxOverlay;viewInspector;selectionController;sceneLoader;visionCoordinator;renderLoop;async bootstrap(){try{this.dom=b(document.querySelector(`#app`));let e=await S.initialize(e=>{this.dom.statusText.innerText=e});if(!e)return;this.initCoreServices(e.device,e.wasmModule),this.initInputs(),this.initUiAndCoordinators(),this.renderLoop=new O(this.dom.canvas,this.wasm,this.pointerInput,this.dom.fpsDisplay),this.renderLoop.start(),this.dom.loadingContainer.style.display=`none`,this.visionCoordinator.checkBackendHealth()}catch(e){console.error(`GauSSCol bootstrap failed:`,e),this.dom?.statusText&&(this.dom.statusText.innerText=`Error initializing: ${e.message}`)}}initCoreServices(t,n){this.wasm=new e(n),this.gaussianIdPass=new _(t),this.refinementService=new v(this.wasm),this.selectionController=new C(this.wasm,this.refinementService),this.semanticManager=new y(this.wasm,this.gaussianIdPass,this.refinementService,1),this.visionClient=new s(`http://127.0.0.1:8010`)}initInputs(){window.selectionMode=`orbit`,this.pointerInput=new t(this.dom.canvas,this.wasm),this.lassoInput=new n(this.dom.canvas,this.wasm,()=>{this.selectionController.updateSelectionCount()})}initUiAndCoordinators(){let e=this.dom.rootContainer;this.bboxOverlay=new c(e),this.viewInspector=new f(e),this.visionCoordinator=new D(this.dom.canvas,this.wasm,this.semanticManager,this.visionClient,this.bboxOverlay,this.viewInspector,{updateSelectionCount:()=>this.selectionController.updateSelectionCount(),clearRefinementStatus:()=>this.sidePanel.setRefinementStatus(null),clearSelection:()=>{this.refinementService.resetState(),this.wasm.clearSelection()}}),this.sidePanel=new o(e,this.wasm,{onSelectionModeChanged:e=>{window.selectionMode=e,this.dom.canvas.style.cursor=e===`lasso`?`cell`:`default`},onLassoDepthChanged:e=>this.wasm.setLassoDepthRatio(e),onDeleteSelected:()=>this.selectionController.deleteSelected(),onClearSelection:()=>this.selectionController.clearSelection(),onRefineSelection:()=>this.selectionController.refineStep(),onRefineToCompletion:()=>this.selectionController.refineToCompletion(),onUpdateRefinementConfig:e=>this.selectionController.updateRefinementConfig(e),onLoadFile:()=>this.dom.fileInput.click(),onLoadDemo:()=>this.sceneLoader.loadDemoRoom(),onLoadDemoMesh:e=>this.sceneLoader.loadDemoMesh(e),onToggleGrid:e=>this.wasm.setGridEnabled(e)}),this.selectionController.setSidePanel(this.sidePanel),this.sceneLoader=new w(this.wasm,this.gaussianIdPass,this.sidePanel,this.refinementService,this.dom.loadingContainer,this.dom.statusText,this.dom.canvas,{onSceneReset:()=>this.handleSceneReset(),updateSelectionCount:()=>this.selectionController.updateSelectionCount()}),this.dom.fileInput.addEventListener(`change`,()=>{let e=this.dom.fileInput.files?.[0];e&&(this.sceneLoader.loadLocalFile(e),this.dom.fileInput.value=``)}),this.askVisionPanel=new d(e,{onRunQuery:e=>this.visionCoordinator.handleRunQuery(e),onToggleSamMask:()=>this.bboxOverlay.toggleSamMask(),onToggleBoundingBoxes:()=>this.bboxOverlay.toggleBoundingBoxes(),onShowView:e=>this.visionCoordinator.handleShowView(e),onGenerateRecommendedView:(e,t,n)=>this.visionCoordinator.handleRecommendedView(e,t,n),onCoverageModeChanged:e=>this.semanticManager.setComprehensiveCoverage(e),onRetryConnection:()=>this.visionCoordinator.retryBackendConnection(),onClear:()=>this.visionCoordinator.handleClear()}),this.visionCoordinator.setAskVisionPanel(this.askVisionPanel)}handleSceneReset(){this.lassoInput.cancel(),window.selectionMode=`orbit`,this.dom.canvas.style.cursor=`default`,this.wasm.clearSelection(),this.visionCoordinator.resetForNewScene()}}().bootstrap();