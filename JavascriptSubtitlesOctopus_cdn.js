function worker_function() {
	null;
	var Module = typeof Module != "undefined" ? Module : {};
	var hasNativeConsole = typeof console !== "undefined";

	function makeCustomConsole() {
		var console = function () {
			function postConsoleMessage(prefix, args) {
				postMessage({
					target: "console-" + prefix,
					content: JSON.stringify(Array.prototype.slice.call(args))
				})
			}
			return {
				log: function () {
					postConsoleMessage("log", arguments)
				},
				debug: function () {
					postConsoleMessage("debug", arguments)
				},
				info: function () {
					postConsoleMessage("info", arguments)
				},
				warn: function () {
					postConsoleMessage("warn", arguments)
				},
				error: function () {
					postConsoleMessage("error", arguments)
				}
			}
		}();
		return console
	}
	Module = Module || {};
	Module["preRun"] = Module["preRun"] || [];
	Module["preRun"].push(function () {
		debugger
		Module["FS_createPath"]("/", "fonts", true, true);
		Module["FS_createPath"]("/", "fontconfig", true, true);
		if (!self.subContent) {
			self.subContent = read_(self.subUrl)
		}
		if (self.availableFonts && self.availableFonts.length !== 0) {
			var sections = parseAss(self.subContent);
			for (var i = 0; i < sections.length; i++) {
				for (var j = 0; j < sections[i].body.length; j++) {
					if (sections[i].body[j].key === "Style") {
						self.writeFontToFS(sections[i].body[j].value["Fontname"])
					}
				}
			}
			var regex = /\\fn([^\\}]*?)[\\}]/g;
			var matches;
			while (matches = regex.exec(self.subContent)) {
				self.writeFontToFS(matches[1])
			}
		}
		if (self.subContent) {
			Module["FS"].writeFile("/sub.ass", self.subContent)
		}
		self.subContent = null;
		self.loadFontFile(".fallback-", self.fallbackFont);
		var fontFiles = self.fontFiles || [];
		for (var i = 0; i < fontFiles.length; i++) {
			self.loadFontFile("font" + i + "-", fontFiles[i])
		}
	});
	Module["onRuntimeInitialized"] = function () {
		self.octObj = new Module.SubtitleOctopus;
		self.changed = Module._malloc(4);
		self.blendTime = Module._malloc(8);
		self.blendX = Module._malloc(4);
		self.blendY = Module._malloc(4);
		self.blendW = Module._malloc(4);
		self.blendH = Module._malloc(4);
		self.octObj.initLibrary(screen.width, screen.height, "/fonts/.fallback-" + self.fallbackFont.split("/").pop());
		self.octObj.setDropAnimations(self.dropAllAnimations);
		self.octObj.createTrack("/sub.ass");
		self.ass_track = self.octObj.track;
		self.ass_library = self.octObj.ass_library;
		self.ass_renderer = self.octObj.ass_renderer;
		if (self.libassMemoryLimit > 0 || self.libassGlyphLimit > 0) {
			self.octObj.setMemoryLimits(self.libassGlyphLimit, self.libassMemoryLimit)
		}
	};
	Module["print"] = function (text) {
		if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(" ");
		console.log(text)
	};
	Module["printErr"] = function (text) {
		if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(" ");
		console.error(text)
	};
	if (!hasNativeConsole) {
		var console = {
			log: function (x) {
				if (typeof dump === "function") dump("log: " + x + "\n")
			},
			debug: function (x) {
				if (typeof dump === "function") dump("debug: " + x + "\n")
			},
			info: function (x) {
				if (typeof dump === "function") dump("info: " + x + "\n")
			},
			warn: function (x) {
				if (typeof dump === "function") dump("warn: " + x + "\n")
			},
			error: function (x) {
				if (typeof dump === "function") dump("error: " + x + "\n")
			}
		}
	}
	var moduleOverrides = Object.assign({}, Module);
	var arguments_ = [];
	var thisProgram = "./this.program";
	var quit_ = (status, toThrow) => {
		throw toThrow
	};
	var ENVIRONMENT_IS_WEB = typeof window == "object";
	var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
	var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
	var scriptDirectory = "";

	function locateFile(path) {
		if (Module["locateFile"]) {
			return Module["locateFile"](path, scriptDirectory)
		}
		return scriptDirectory + path
	}
	var read_, readAsync, readBinary, setWindowTitle;
	if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
		if (ENVIRONMENT_IS_WORKER) {
			scriptDirectory = self.location.href
		} else if (typeof document != "undefined" && document.currentScript) {
			scriptDirectory = document.currentScript.src
		}
		if (scriptDirectory.indexOf("blob:") !== 0) {
			scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1)
		} else {
			scriptDirectory = ""
		} {
			read_ = url => {
				var xhr = new XMLHttpRequest;
				xhr.open("GET", url, false);
				xhr.send(null);
				return xhr.responseText
			};
			if (ENVIRONMENT_IS_WORKER) {
				readBinary = url => {
					var xhr = new XMLHttpRequest;
					xhr.open("GET", url, false);
					xhr.responseType = "arraybuffer";
					xhr.send(null);
					return new Uint8Array(xhr.response)
				}
			}
			readAsync = (url, onload, onerror) => {
				debugger
				if (url === "default.woff2") { // 尴尬了 原来我一直少写了个等号
					// url = 'https://libass.github.io/JavascriptSubtitlesOctopus/assets/js/default.woff2'\
					url = 'https://raw.githubusercontent.com/freemedom/ass/main/NotoSansSC-Regular.otf'

				}
				var xhr = new XMLHttpRequest;
				xhr.open("GET", url, true);
				xhr.responseType = "arraybuffer";
				xhr.onload = () => {
					if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
						onload(xhr.response);
						return
					}
					onerror()
				};
				xhr.onerror = onerror;
				xhr.send(null)
			}
		}
		setWindowTitle = title => document.title = title
	} else {}
	var out = Module["print"] || console.log.bind(console);
	var err = Module["printErr"] || console.warn.bind(console);
	Object.assign(Module, moduleOverrides);
	moduleOverrides = null;
	if (Module["arguments"]) arguments_ = Module["arguments"];
	if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
	if (Module["quit"]) quit_ = Module["quit"];

	function warnOnce(text) {
		if (!warnOnce.shown) warnOnce.shown = {};
		if (!warnOnce.shown[text]) {
			warnOnce.shown[text] = 1;
			err(text)
		}
	}
	var tempRet0 = 0;
	var setTempRet0 = value => {
		tempRet0 = value
	};
	var getTempRet0 = () => tempRet0;
	var wasmBinary;
	if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
	var noExitRuntime = Module["noExitRuntime"] || true;
	if (typeof WebAssembly != "object") {
		abort("no native wasm support detected")
	}
	var wasmMemory;
	var ABORT = false;
	var EXITSTATUS;

	function assert(condition, text) {
		if (!condition) {
			abort(text)
		}
	}

	function getCFunc(ident) {
		var func = Module["_" + ident];
		return func
	}

	function ccall(ident, returnType, argTypes, args, opts) {
		var toC = {
			"string": function (str) {
				var ret = 0;
				if (str !== null && str !== undefined && str !== 0) {
					var len = (str.length << 2) + 1;
					ret = stackAlloc(len);
					stringToUTF8(str, ret, len)
				}
				return ret
			},
			"array": function (arr) {
				var ret = stackAlloc(arr.length);
				writeArrayToMemory(arr, ret);
				return ret
			}
		};

		function convertReturnValue(ret) {
			if (returnType === "string") {
				return UTF8ToString(ret)
			}
			if (returnType === "boolean") return Boolean(ret);
			return ret
		}
		var func = getCFunc(ident);
		var cArgs = [];
		var stack = 0;
		if (args) {
			for (var i = 0; i < args.length; i++) {
				var converter = toC[argTypes[i]];
				if (converter) {
					if (stack === 0) stack = stackSave();
					cArgs[i] = converter(args[i])
				} else {
					cArgs[i] = args[i]
				}
			}
		}
		var ret = func.apply(null, cArgs);

		function onDone(ret) {
			if (stack !== 0) stackRestore(stack);
			return convertReturnValue(ret)
		}
		ret = onDone(ret);
		return ret
	}

	function cwrap(ident, returnType, argTypes, opts) {
		argTypes = argTypes || [];
		var numericArgs = argTypes.every(function (type) {
			return type === "number"
		});
		var numericRet = returnType !== "string";
		if (numericRet && numericArgs && !opts) {
			return getCFunc(ident)
		}
		return function () {
			return ccall(ident, returnType, argTypes, arguments, opts)
		}
	}
	var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;

	function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
		var endIdx = idx + maxBytesToRead;
		var endPtr = idx;
		while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
		if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
			return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
		} else {
			var str = "";
			while (idx < endPtr) {
				var u0 = heapOrArray[idx++];
				if (!(u0 & 128)) {
					str += String.fromCharCode(u0);
					continue
				}
				var u1 = heapOrArray[idx++] & 63;
				if ((u0 & 224) == 192) {
					str += String.fromCharCode((u0 & 31) << 6 | u1);
					continue
				}
				var u2 = heapOrArray[idx++] & 63;
				if ((u0 & 240) == 224) {
					u0 = (u0 & 15) << 12 | u1 << 6 | u2
				} else {
					u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63
				}
				if (u0 < 65536) {
					str += String.fromCharCode(u0)
				} else {
					var ch = u0 - 65536;
					str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
				}
			}
		}
		return str
	}

	function UTF8ToString(ptr, maxBytesToRead) {
		return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
	}

	function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
		if (!(maxBytesToWrite > 0)) return 0;
		var startIdx = outIdx;
		var endIdx = outIdx + maxBytesToWrite - 1;
		for (var i = 0; i < str.length; ++i) {
			var u = str.charCodeAt(i);
			if (u >= 55296 && u <= 57343) {
				var u1 = str.charCodeAt(++i);
				u = 65536 + ((u & 1023) << 10) | u1 & 1023
			}
			if (u <= 127) {
				if (outIdx >= endIdx) break;
				heap[outIdx++] = u
			} else if (u <= 2047) {
				if (outIdx + 1 >= endIdx) break;
				heap[outIdx++] = 192 | u >> 6;
				heap[outIdx++] = 128 | u & 63
			} else if (u <= 65535) {
				if (outIdx + 2 >= endIdx) break;
				heap[outIdx++] = 224 | u >> 12;
				heap[outIdx++] = 128 | u >> 6 & 63;
				heap[outIdx++] = 128 | u & 63
			} else {
				if (outIdx + 3 >= endIdx) break;
				heap[outIdx++] = 240 | u >> 18;
				heap[outIdx++] = 128 | u >> 12 & 63;
				heap[outIdx++] = 128 | u >> 6 & 63;
				heap[outIdx++] = 128 | u & 63
			}
		}
		heap[outIdx] = 0;
		return outIdx - startIdx
	}

	function stringToUTF8(str, outPtr, maxBytesToWrite) {
		return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
	}

	function lengthBytesUTF8(str) {
		var len = 0;
		for (var i = 0; i < str.length; ++i) {
			var u = str.charCodeAt(i);
			if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
			if (u <= 127) ++len;
			else if (u <= 2047) len += 2;
			else if (u <= 65535) len += 3;
			else len += 4
		}
		return len
	}

	function allocateUTF8OnStack(str) {
		var size = lengthBytesUTF8(str) + 1;
		var ret = stackAlloc(size);
		stringToUTF8Array(str, HEAP8, ret, size);
		return ret
	}

	function writeArrayToMemory(array, buffer) {
		HEAP8.set(array, buffer)
	}

	function writeAsciiToMemory(str, buffer, dontAddNull) {
		for (var i = 0; i < str.length; ++i) {
			HEAP8[buffer++ >> 0] = str.charCodeAt(i)
		}
		if (!dontAddNull) HEAP8[buffer >> 0] = 0
	}
	var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

	function updateGlobalBufferAndViews(buf) {
		buffer = buf;
		Module["HEAP8"] = HEAP8 = new Int8Array(buf);
		Module["HEAP16"] = HEAP16 = new Int16Array(buf);
		Module["HEAP32"] = HEAP32 = new Int32Array(buf);
		Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
		Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
		Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
		Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
		Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
	}
	var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
	var wasmTable;
	var __ATPRERUN__ = [];
	var __ATINIT__ = [];
	var __ATMAIN__ = [];
	var __ATPOSTRUN__ = [];
	var runtimeInitialized = false;

	function keepRuntimeAlive() {
		return noExitRuntime
	}

	function preRun() {
		if (Module["preRun"]) {
			if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
			while (Module["preRun"].length) {
				addOnPreRun(Module["preRun"].shift())
			}
		}
		callRuntimeCallbacks(__ATPRERUN__)
	}

	function initRuntime() {
		runtimeInitialized = true;
		if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
		FS.ignorePermissions = false;
		TTY.init();
		callRuntimeCallbacks(__ATINIT__)
	}

	function preMain() {
		callRuntimeCallbacks(__ATMAIN__)
	}

	function postRun() {
		if (Module["postRun"]) {
			if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
			while (Module["postRun"].length) {
				addOnPostRun(Module["postRun"].shift())
			}
		}
		callRuntimeCallbacks(__ATPOSTRUN__)
	}

	function addOnPreRun(cb) {
		__ATPRERUN__.unshift(cb)
	}

	function addOnInit(cb) {
		__ATINIT__.unshift(cb)
	}

	function addOnPostRun(cb) {
		__ATPOSTRUN__.unshift(cb)
	}
	var runDependencies = 0;
	var runDependencyWatcher = null;
	var dependenciesFulfilled = null;

	function getUniqueRunDependency(id) {
		return id
	}

	function addRunDependency(id) {
		runDependencies++;
		if (Module["monitorRunDependencies"]) {
			Module["monitorRunDependencies"](runDependencies)
		}
	}

	function removeRunDependency(id) {
		runDependencies--;
		if (Module["monitorRunDependencies"]) {
			Module["monitorRunDependencies"](runDependencies)
		}
		if (runDependencies == 0) {
			if (runDependencyWatcher !== null) {
				clearInterval(runDependencyWatcher);
				runDependencyWatcher = null
			}
			if (dependenciesFulfilled) {
				var callback = dependenciesFulfilled;
				dependenciesFulfilled = null;
				callback()
			}
		}
	}

	function abort(what) {
		{
			if (Module["onAbort"]) {
				Module["onAbort"](what)
			}
		}
		what = "Aborted(" + what + ")";
		err(what);
		ABORT = true;
		EXITSTATUS = 1;
		what += ". Build with -sASSERTIONS for more info.";
		var e = new WebAssembly.RuntimeError(what);
		throw e
	}
	var dataURIPrefix = "data:application/octet-stream;base64,";

	function isDataURI(filename) {
		return filename.startsWith(dataURIPrefix)
	}

	function isFileURI(filename) {
		return filename.startsWith("file://")
	}
	var wasmBinaryFile;
	wasmBinaryFile = "subtitles-octopus-worker.wasm";
	if (!isDataURI(wasmBinaryFile)) {
		wasmBinaryFile = locateFile(wasmBinaryFile)
	}

	function getBinary(file) {
		try {
			if (file == wasmBinaryFile && wasmBinary) {
				return new Uint8Array(wasmBinary)
			}
			if (readBinary) {
				return readBinary(file)
			} else {
				throw "both async and sync fetching of the wasm failed"
			}
		} catch (err) {
			abort(err)
		}
	}

	function getBinaryPromise() {
		debugger
		if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
			if (typeof fetch == "function" && !isFileURI(wasmBinaryFile)) {
				return fetch('https://libass.github.io/JavascriptSubtitlesOctopus/assets/js/subtitles-octopus-worker.wasm', {
					credentials: "same-origin"
				}).then(function (response) {
					if (!response["ok"]) {
						throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
					}
					return response["arrayBuffer"]()
				}).catch(function () {
					return getBinary(wasmBinaryFile)
				})
			} else {
				if (readAsync) {
					return new Promise(function (resolve, reject) {
						readAsync(wasmBinaryFile, function (response) {
							resolve(new Uint8Array(response))
						}, reject)
					})
				}
			}
		}
		return Promise.resolve().then(function () {
			return getBinary(wasmBinaryFile)
		})
	}

	function createWasm() {
		var info = {
			"a": asmLibraryArg
		};

		function receiveInstance(instance, module) {
			var exports = instance.exports;
			Module["asm"] = exports;
			wasmMemory = Module["asm"]["N"];
			updateGlobalBufferAndViews(wasmMemory.buffer);
			wasmTable = Module["asm"]["_d"];
			addOnInit(Module["asm"]["O"]);
			removeRunDependency("wasm-instantiate")
		}
		addRunDependency("wasm-instantiate");

		function receiveInstantiationResult(result) {
			receiveInstance(result["instance"])
		}

		function instantiateArrayBuffer(receiver) {
			return getBinaryPromise().then(function (binary) {
				return WebAssembly.instantiate(binary, info)
			}).then(function (instance) {
				return instance
			}).then(receiver, function (reason) {
				err("failed to asynchronously prepare wasm: " + reason);
				abort(reason)
			})
		}

		function instantiateAsync() {
			if (!wasmBinary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch == "function") {
				return fetch('https://libass.github.io/JavascriptSubtitlesOctopus/assets/js/subtitles-octopus-worker.wasm', {
					credentials: "same-origin"
				}).then(function (response) {
					var result = WebAssembly.instantiateStreaming(response, info);
					return result.then(receiveInstantiationResult, function (reason) {
						err("wasm streaming compile failed: " + reason);
						err("falling back to ArrayBuffer instantiation");
						return instantiateArrayBuffer(receiveInstantiationResult)
					})
				})
			} else {
				return instantiateArrayBuffer(receiveInstantiationResult)
			}
		}
		if (Module["instantiateWasm"]) {
			try {
				var exports = Module["instantiateWasm"](info, receiveInstance);
				return exports
			} catch (e) {
				err("Module.instantiateWasm callback failed with error: " + e);
				return false
			}
		}
		instantiateAsync();
		return {}
	}
	var tempDouble;
	var tempI64;

	function _emscripten_set_main_loop_timing(mode, value) {
		Browser.mainLoop.timingMode = mode;
		Browser.mainLoop.timingValue = value;
		if (!Browser.mainLoop.func) {
			return 1
		}
		if (!Browser.mainLoop.running) {
			Browser.mainLoop.running = true
		}
		if (mode == 0) {
			Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
				var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
				setTimeout(Browser.mainLoop.runner, timeUntilNextTick)
			};
			Browser.mainLoop.method = "timeout"
		} else if (mode == 1) {
			Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
				Browser.requestAnimationFrame(Browser.mainLoop.runner)
			};
			Browser.mainLoop.method = "rAF"
		} else if (mode == 2) {
			if (typeof setImmediate == "undefined") {
				var setImmediates = [];
				var emscriptenMainLoopMessageId = "setimmediate";
				var Browser_setImmediate_messageHandler = function (event) {
					if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
						event.stopPropagation();
						setImmediates.shift()()
					}
				};
				addEventListener("message", Browser_setImmediate_messageHandler, true);
				setImmediate = function Browser_emulated_setImmediate(func) {
					setImmediates.push(func);
					if (ENVIRONMENT_IS_WORKER) {
						if (Module["setImmediates"] === undefined) Module["setImmediates"] = [];
						Module["setImmediates"].push(func);
						postMessage({
							target: emscriptenMainLoopMessageId
						})
					} else postMessage(emscriptenMainLoopMessageId, "*")
				}
			}
			Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
				setImmediate(Browser.mainLoop.runner)
			};
			Browser.mainLoop.method = "immediate"
		}
		return 0
	}
	var _emscripten_get_now;
	_emscripten_get_now = () => performance.now();

	function _exit(status) {
		exit(status)
	}

	function handleException(e) {
		if (e instanceof ExitStatus || e == "unwind") {
			return EXITSTATUS
		}
		quit_(1, e)
	}

	function maybeExit() {}

	function setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) {
		assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
		Browser.mainLoop.func = browserIterationFunc;
		Browser.mainLoop.arg = arg;
		var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;

		function checkIsRunning() {
			if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
				maybeExit();
				return false
			}
			return true
		}
		Browser.mainLoop.running = false;
		Browser.mainLoop.runner = function Browser_mainLoop_runner() {
			if (ABORT) return;
			if (Browser.mainLoop.queue.length > 0) {
				var start = Date.now();
				var blocker = Browser.mainLoop.queue.shift();
				blocker.func(blocker.arg);
				if (Browser.mainLoop.remainingBlockers) {
					var remaining = Browser.mainLoop.remainingBlockers;
					var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
					if (blocker.counted) {
						Browser.mainLoop.remainingBlockers = next
					} else {
						next = next + .5;
						Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9
					}
				}
				out('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
				Browser.mainLoop.updateStatus();
				if (!checkIsRunning()) return;
				setTimeout(Browser.mainLoop.runner, 0);
				return
			}
			if (!checkIsRunning()) return;
			Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
			if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
				Browser.mainLoop.scheduler();
				return
			} else if (Browser.mainLoop.timingMode == 0) {
				Browser.mainLoop.tickStartTime = _emscripten_get_now()
			}
			Browser.mainLoop.runIter(browserIterationFunc);
			if (!checkIsRunning()) return;
			if (typeof SDL == "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
			Browser.mainLoop.scheduler()
		};
		if (!noSetTiming) {
			if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
			else _emscripten_set_main_loop_timing(1, 1);
			Browser.mainLoop.scheduler()
		}
		if (simulateInfiniteLoop) {
			throw "unwind"
		}
	}

	function callUserCallback(func, synchronous) {
		if (ABORT) {
			return
		}
		if (synchronous) {
			func();
			return
		}
		try {
			func()
		} catch (e) {
			handleException(e)
		}
	}

	function safeSetTimeout(func, timeout) {
		return setTimeout(function () {
			callUserCallback(func)
		}, timeout)
	}
	var Browser = {
		mainLoop: {
			running: false,
			scheduler: null,
			method: "",
			currentlyRunningMainloop: 0,
			func: null,
			arg: 0,
			timingMode: 0,
			timingValue: 0,
			currentFrameNumber: 0,
			queue: [],
			pause: function () {
				Browser.mainLoop.scheduler = null;
				Browser.mainLoop.currentlyRunningMainloop++
			},
			resume: function () {
				Browser.mainLoop.currentlyRunningMainloop++;
				var timingMode = Browser.mainLoop.timingMode;
				var timingValue = Browser.mainLoop.timingValue;
				var func = Browser.mainLoop.func;
				Browser.mainLoop.func = null;
				setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
				_emscripten_set_main_loop_timing(timingMode, timingValue);
				Browser.mainLoop.scheduler()
			},
			updateStatus: function () {
				if (Module["setStatus"]) {
					var message = Module["statusMessage"] || "Please wait...";
					var remaining = Browser.mainLoop.remainingBlockers;
					var expected = Browser.mainLoop.expectedBlockers;
					if (remaining) {
						if (remaining < expected) {
							Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
						} else {
							Module["setStatus"](message)
						}
					} else {
						Module["setStatus"]("")
					}
				}
			},
			runIter: function (func) {
				if (ABORT) return;
				if (Module["preMainLoop"]) {
					var preRet = Module["preMainLoop"]();
					if (preRet === false) {
						return
					}
				}
				callUserCallback(func);
				if (Module["postMainLoop"]) Module["postMainLoop"]()
			}
		},
		isFullscreen: false,
		pointerLock: false,
		moduleContextCreatedCallbacks: [],
		workers: [],
		init: function () {
			if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
			if (Browser.initted) return;
			Browser.initted = true;
			try {
				new Blob;
				Browser.hasBlobConstructor = true
			} catch (e) {
				Browser.hasBlobConstructor = false;
				out("warning: no blob constructor, cannot create blobs with mimetypes")
			}
			Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? out("warning: no BlobBuilder") : null;
			Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
			if (!Module.noImageDecoding && typeof Browser.URLObject == "undefined") {
				out("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
				Module.noImageDecoding = true
			}
			var imagePlugin = {};
			imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
				return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
			};
			imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
				var b = null;
				if (Browser.hasBlobConstructor) {
					try {
						b = new Blob([byteArray], {
							type: Browser.getMimetype(name)
						});
						if (b.size !== byteArray.length) {
							b = new Blob([new Uint8Array(byteArray).buffer], {
								type: Browser.getMimetype(name)
							})
						}
					} catch (e) {
						warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
					}
				}
				if (!b) {
					var bb = new Browser.BlobBuilder;
					bb.append(new Uint8Array(byteArray).buffer);
					b = bb.getBlob()
				}
				var url = Browser.URLObject.createObjectURL(b);
				var img = new Image;
				img.onload = () => {
					assert(img.complete, "Image " + name + " could not be decoded");
					var canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0);
					preloadedImages[name] = canvas;
					Browser.URLObject.revokeObjectURL(url);
					if (onload) onload(byteArray)
				};
				img.onerror = event => {
					out("Image " + url + " could not be decoded");
					if (onerror) onerror()
				};
				img.src = url
			};
			Module["preloadPlugins"].push(imagePlugin);
			var audioPlugin = {};
			audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
				return !Module.noAudioDecoding && name.substr(-4) in {
					".ogg": 1,
					".wav": 1,
					".mp3": 1
				}
			};
			audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
				var done = false;

				function finish(audio) {
					if (done) return;
					done = true;
					preloadedAudios[name] = audio;
					if (onload) onload(byteArray)
				}

				function fail() {
					if (done) return;
					done = true;
					preloadedAudios[name] = new Audio;
					if (onerror) onerror()
				}
				if (Browser.hasBlobConstructor) {
					try {
						var b = new Blob([byteArray], {
							type: Browser.getMimetype(name)
						})
					} catch (e) {
						return fail()
					}
					var url = Browser.URLObject.createObjectURL(b);
					var audio = new Audio;
					audio.addEventListener("canplaythrough", function () {
						finish(audio)
					}, false);
					audio.onerror = function audio_onerror(event) {
						if (done) return;
						out("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");

						function encode64(data) {
							var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
							var PAD = "=";
							var ret = "";
							var leftchar = 0;
							var leftbits = 0;
							for (var i = 0; i < data.length; i++) {
								leftchar = leftchar << 8 | data[i];
								leftbits += 8;
								while (leftbits >= 6) {
									var curr = leftchar >> leftbits - 6 & 63;
									leftbits -= 6;
									ret += BASE[curr]
								}
							}
							if (leftbits == 2) {
								ret += BASE[(leftchar & 3) << 4];
								ret += PAD + PAD
							} else if (leftbits == 4) {
								ret += BASE[(leftchar & 15) << 2];
								ret += PAD
							}
							return ret
						}
						audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
						finish(audio)
					};
					audio.src = url;
					safeSetTimeout(function () {
						finish(audio)
					}, 1e4)
				} else {
					return fail()
				}
			};
			Module["preloadPlugins"].push(audioPlugin);

			function pointerLockChange() {
				Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]
			}
			var canvas = Module["canvas"];
			if (canvas) {
				canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || function () {};
				canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || function () {};
				canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
				document.addEventListener("pointerlockchange", pointerLockChange, false);
				document.addEventListener("mozpointerlockchange", pointerLockChange, false);
				document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
				document.addEventListener("mspointerlockchange", pointerLockChange, false);
				if (Module["elementPointerLock"]) {
					canvas.addEventListener("click", function (ev) {
						if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
							Module["canvas"].requestPointerLock();
							ev.preventDefault()
						}
					}, false)
				}
			}
		},
		handledByPreloadPlugin: function (byteArray, fullname, finish, onerror) {
			Browser.init();
			var handled = false;
			Module["preloadPlugins"].forEach(function (plugin) {
				if (handled) return;
				if (plugin["canHandle"](fullname)) {
					plugin["handle"](byteArray, fullname, finish, onerror);
					handled = true
				}
			});
			return handled
		},
		createContext: function (canvas, useWebGL, setInModule, webGLContextAttributes) {
			if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
			var ctx;
			var contextHandle;
			if (useWebGL) {
				var contextAttributes = {
					antialias: false,
					alpha: false,
					majorVersion: 1
				};
				if (webGLContextAttributes) {
					for (var attribute in webGLContextAttributes) {
						contextAttributes[attribute] = webGLContextAttributes[attribute]
					}
				}
				if (typeof GL != "undefined") {
					contextHandle = GL.createContext(canvas, contextAttributes);
					if (contextHandle) {
						ctx = GL.getContext(contextHandle).GLctx
					}
				}
			} else {
				ctx = canvas.getContext("2d")
			}
			if (!ctx) return null;
			if (setInModule) {
				if (!useWebGL) assert(typeof GLctx == "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
				Module.ctx = ctx;
				if (useWebGL) GL.makeContextCurrent(contextHandle);
				Module.useWebGL = useWebGL;
				Browser.moduleContextCreatedCallbacks.forEach(function (callback) {
					callback()
				});
				Browser.init()
			}
			return ctx
		},
		destroyContext: function (canvas, useWebGL, setInModule) {},
		fullscreenHandlersInstalled: false,
		lockPointer: undefined,
		resizeCanvas: undefined,
		requestFullscreen: function (lockPointer, resizeCanvas) {
			Browser.lockPointer = lockPointer;
			Browser.resizeCanvas = resizeCanvas;
			if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
			if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
			var canvas = Module["canvas"];

			function fullscreenChange() {
				Browser.isFullscreen = false;
				var canvasContainer = canvas.parentNode;
				if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
					canvas.exitFullscreen = Browser.exitFullscreen;
					if (Browser.lockPointer) canvas.requestPointerLock();
					Browser.isFullscreen = true;
					if (Browser.resizeCanvas) {
						Browser.setFullscreenCanvasSize()
					} else {
						Browser.updateCanvasDimensions(canvas)
					}
				} else {
					canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
					canvasContainer.parentNode.removeChild(canvasContainer);
					if (Browser.resizeCanvas) {
						Browser.setWindowedCanvasSize()
					} else {
						Browser.updateCanvasDimensions(canvas)
					}
				}
				if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
				if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen)
			}
			if (!Browser.fullscreenHandlersInstalled) {
				Browser.fullscreenHandlersInstalled = true;
				document.addEventListener("fullscreenchange", fullscreenChange, false);
				document.addEventListener("mozfullscreenchange", fullscreenChange, false);
				document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
				document.addEventListener("MSFullscreenChange", fullscreenChange, false)
			}
			var canvasContainer = document.createElement("div");
			canvas.parentNode.insertBefore(canvasContainer, canvas);
			canvasContainer.appendChild(canvas);
			canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? function () {
				canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])
			} : null) || (canvasContainer["webkitRequestFullScreen"] ? function () {
				canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
			} : null);
			canvasContainer.requestFullscreen()
		},
		exitFullscreen: function () {
			if (!Browser.isFullscreen) {
				return false
			}
			var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || function () {};
			CFS.apply(document, []);
			return true
		},
		nextRAF: 0,
		fakeRequestAnimationFrame: function (func) {
			var now = Date.now();
			if (Browser.nextRAF === 0) {
				Browser.nextRAF = now + 1e3 / 60
			} else {
				while (now + 2 >= Browser.nextRAF) {
					Browser.nextRAF += 1e3 / 60
				}
			}
			var delay = Math.max(Browser.nextRAF - now, 0);
			setTimeout(func, delay)
		},
		requestAnimationFrame: function (func) {
			if (typeof requestAnimationFrame == "function") {
				requestAnimationFrame(func);
				return
			}
			var RAF = Browser.fakeRequestAnimationFrame;
			RAF(func)
		},
		safeSetTimeout: function (func) {
			return safeSetTimeout(func)
		},
		safeRequestAnimationFrame: function (func) {
			return Browser.requestAnimationFrame(function () {
				callUserCallback(func)
			})
		},
		getMimetype: function (name) {
			return {
				"jpg": "image/jpeg",
				"jpeg": "image/jpeg",
				"png": "image/png",
				"bmp": "image/bmp",
				"ogg": "audio/ogg",
				"wav": "audio/wav",
				"mp3": "audio/mpeg"
			} [name.substr(name.lastIndexOf(".") + 1)]
		},
		getUserMedia: function (func) {
			if (!window.getUserMedia) {
				window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
			}
			window.getUserMedia(func)
		},
		getMovementX: function (event) {
			return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
		},
		getMovementY: function (event) {
			return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
		},
		getMouseWheelDelta: function (event) {
			var delta = 0;
			switch (event.type) {
				case "DOMMouseScroll":
					delta = event.detail / 3;
					break;
				case "mousewheel":
					delta = event.wheelDelta / 120;
					break;
				case "wheel":
					delta = event.deltaY;
					switch (event.deltaMode) {
						case 0:
							delta /= 100;
							break;
						case 1:
							delta /= 3;
							break;
						case 2:
							delta *= 80;
							break;
						default:
							throw "unrecognized mouse wheel delta mode: " + event.deltaMode
					}
					break;
				default:
					throw "unrecognized mouse wheel event: " + event.type
			}
			return delta
		},
		mouseX: 0,
		mouseY: 0,
		mouseMovementX: 0,
		mouseMovementY: 0,
		touches: {},
		lastTouches: {},
		calculateMouseEvent: function (event) {
			if (Browser.pointerLock) {
				if (event.type != "mousemove" && "mozMovementX" in event) {
					Browser.mouseMovementX = Browser.mouseMovementY = 0
				} else {
					Browser.mouseMovementX = Browser.getMovementX(event);
					Browser.mouseMovementY = Browser.getMovementY(event)
				}
				if (typeof SDL != "undefined") {
					Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
					Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
				} else {
					Browser.mouseX += Browser.mouseMovementX;
					Browser.mouseY += Browser.mouseMovementY
				}
			} else {
				var rect = Module["canvas"].getBoundingClientRect();
				var cw = Module["canvas"].width;
				var ch = Module["canvas"].height;
				var scrollX = typeof window.scrollX != "undefined" ? window.scrollX : window.pageXOffset;
				var scrollY = typeof window.scrollY != "undefined" ? window.scrollY : window.pageYOffset;
				if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
					var touch = event.touch;
					if (touch === undefined) {
						return
					}
					var adjustedX = touch.pageX - (scrollX + rect.left);
					var adjustedY = touch.pageY - (scrollY + rect.top);
					adjustedX = adjustedX * (cw / rect.width);
					adjustedY = adjustedY * (ch / rect.height);
					var coords = {
						x: adjustedX,
						y: adjustedY
					};
					if (event.type === "touchstart") {
						Browser.lastTouches[touch.identifier] = coords;
						Browser.touches[touch.identifier] = coords
					} else if (event.type === "touchend" || event.type === "touchmove") {
						var last = Browser.touches[touch.identifier];
						if (!last) last = coords;
						Browser.lastTouches[touch.identifier] = last;
						Browser.touches[touch.identifier] = coords
					}
					return
				}
				var x = event.pageX - (scrollX + rect.left);
				var y = event.pageY - (scrollY + rect.top);
				x = x * (cw / rect.width);
				y = y * (ch / rect.height);
				Browser.mouseMovementX = x - Browser.mouseX;
				Browser.mouseMovementY = y - Browser.mouseY;
				Browser.mouseX = x;
				Browser.mouseY = y
			}
		},
		resizeListeners: [],
		updateResizeListeners: function () {
			var canvas = Module["canvas"];
			Browser.resizeListeners.forEach(function (listener) {
				listener(canvas.width, canvas.height)
			})
		},
		setCanvasSize: function (width, height, noUpdates) {
			var canvas = Module["canvas"];
			Browser.updateCanvasDimensions(canvas, width, height);
			if (!noUpdates) Browser.updateResizeListeners()
		},
		windowedWidth: 0,
		windowedHeight: 0,
		setFullscreenCanvasSize: function () {
			if (typeof SDL != "undefined") {
				var flags = HEAPU32[SDL.screen >> 2];
				flags = flags | 8388608;
				HEAP32[SDL.screen >> 2] = flags
			}
			Browser.updateCanvasDimensions(Module["canvas"]);
			Browser.updateResizeListeners()
		},
		setWindowedCanvasSize: function () {
			if (typeof SDL != "undefined") {
				var flags = HEAPU32[SDL.screen >> 2];
				flags = flags & ~8388608;
				HEAP32[SDL.screen >> 2] = flags
			}
			Browser.updateCanvasDimensions(Module["canvas"]);
			Browser.updateResizeListeners()
		},
		updateCanvasDimensions: function (canvas, wNative, hNative) {
			if (wNative && hNative) {
				canvas.widthNative = wNative;
				canvas.heightNative = hNative
			} else {
				wNative = canvas.widthNative;
				hNative = canvas.heightNative
			}
			var w = wNative;
			var h = hNative;
			if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
				if (w / h < Module["forcedAspectRatio"]) {
					w = Math.round(h * Module["forcedAspectRatio"])
				} else {
					h = Math.round(w / Module["forcedAspectRatio"])
				}
			}
			if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
				var factor = Math.min(screen.width / w, screen.height / h);
				w = Math.round(w * factor);
				h = Math.round(h * factor)
			}
			if (Browser.resizeCanvas) {
				if (canvas.width != w) canvas.width = w;
				if (canvas.height != h) canvas.height = h;
				if (typeof canvas.style != "undefined") {
					canvas.style.removeProperty("width");
					canvas.style.removeProperty("height")
				}
			} else {
				if (canvas.width != wNative) canvas.width = wNative;
				if (canvas.height != hNative) canvas.height = hNative;
				if (typeof canvas.style != "undefined") {
					if (w != wNative || h != hNative) {
						canvas.style.setProperty("width", w + "px", "important");
						canvas.style.setProperty("height", h + "px", "important")
					} else {
						canvas.style.removeProperty("width");
						canvas.style.removeProperty("height")
					}
				}
			}
		}
	};

	function callRuntimeCallbacks(callbacks) {
		while (callbacks.length > 0) {
			callbacks.shift()(Module)
		}
	}

	function getValue(ptr, type = "i8") {
		if (type.endsWith("*")) type = "*";
		switch (type) {
			case "i1":
				return HEAP8[ptr >> 0];
			case "i8":
				return HEAP8[ptr >> 0];
			case "i16":
				return HEAP16[ptr >> 1];
			case "i32":
				return HEAP32[ptr >> 2];
			case "i64":
				return HEAP32[ptr >> 2];
			case "float":
				return HEAPF32[ptr >> 2];
			case "double":
				return HEAPF64[ptr >> 3];
			case "*":
				return HEAPU32[ptr >> 2];
			default:
				abort("invalid type for getValue: " + type)
		}
		return null
	}
	var wasmTableMirror = [];

	function getWasmTableEntry(funcPtr) {
		var func = wasmTableMirror[funcPtr];
		if (!func) {
			if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
			wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr)
		}
		return func
	}

	function ___assert_fail(condition, filename, line, func) {
		abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"])
	}
	var PATH = {
		isAbs: path => path.charAt(0) === "/",
		splitPath: filename => {
			var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
			return splitPathRe.exec(filename).slice(1)
		},
		normalizeArray: (parts, allowAboveRoot) => {
			var up = 0;
			for (var i = parts.length - 1; i >= 0; i--) {
				var last = parts[i];
				if (last === ".") {
					parts.splice(i, 1)
				} else if (last === "..") {
					parts.splice(i, 1);
					up++
				} else if (up) {
					parts.splice(i, 1);
					up--
				}
			}
			if (allowAboveRoot) {
				for (; up; up--) {
					parts.unshift("..")
				}
			}
			return parts
		},
		normalize: path => {
			var isAbsolute = PATH.isAbs(path),
				trailingSlash = path.substr(-1) === "/";
			path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
			if (!path && !isAbsolute) {
				path = "."
			}
			if (path && trailingSlash) {
				path += "/"
			}
			return (isAbsolute ? "/" : "") + path
		},
		dirname: path => {
			var result = PATH.splitPath(path),
				root = result[0],
				dir = result[1];
			if (!root && !dir) {
				return "."
			}
			if (dir) {
				dir = dir.substr(0, dir.length - 1)
			}
			return root + dir
		},
		basename: path => {
			if (path === "/") return "/";
			path = PATH.normalize(path);
			path = path.replace(/\/$/, "");
			var lastSlash = path.lastIndexOf("/");
			if (lastSlash === -1) return path;
			return path.substr(lastSlash + 1)
		},
		join: function () {
			var paths = Array.prototype.slice.call(arguments, 0);
			return PATH.normalize(paths.join("/"))
		},
		join2: (l, r) => {
			return PATH.normalize(l + "/" + r)
		}
	};

	function getRandomDevice() {
		if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
			var randomBuffer = new Uint8Array(1);
			return function () {
				crypto.getRandomValues(randomBuffer);
				return randomBuffer[0]
			}
		} else return function () {
			abort("randomDevice")
		}
	}
	var PATH_FS = {
		resolve: function () {
			var resolvedPath = "",
				resolvedAbsolute = false;
			for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
				var path = i >= 0 ? arguments[i] : FS.cwd();
				if (typeof path != "string") {
					throw new TypeError("Arguments to path.resolve must be strings")
				} else if (!path) {
					return ""
				}
				resolvedPath = path + "/" + resolvedPath;
				resolvedAbsolute = PATH.isAbs(path)
			}
			resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
			return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
		},
		relative: (from, to) => {
			from = PATH_FS.resolve(from).substr(1);
			to = PATH_FS.resolve(to).substr(1);

			function trim(arr) {
				var start = 0;
				for (; start < arr.length; start++) {
					if (arr[start] !== "") break
				}
				var end = arr.length - 1;
				for (; end >= 0; end--) {
					if (arr[end] !== "") break
				}
				if (start > end) return [];
				return arr.slice(start, end - start + 1)
			}
			var fromParts = trim(from.split("/"));
			var toParts = trim(to.split("/"));
			var length = Math.min(fromParts.length, toParts.length);
			var samePartsLength = length;
			for (var i = 0; i < length; i++) {
				if (fromParts[i] !== toParts[i]) {
					samePartsLength = i;
					break
				}
			}
			var outputParts = [];
			for (var i = samePartsLength; i < fromParts.length; i++) {
				outputParts.push("..")
			}
			outputParts = outputParts.concat(toParts.slice(samePartsLength));
			return outputParts.join("/")
		}
	};
	var TTY = {
		ttys: [],
		init: function () {},
		shutdown: function () {},
		register: function (dev, ops) {
			TTY.ttys[dev] = {
				input: [],
				output: [],
				ops: ops
			};
			FS.registerDevice(dev, TTY.stream_ops)
		},
		stream_ops: {
			open: function (stream) {
				var tty = TTY.ttys[stream.node.rdev];
				if (!tty) {
					throw new FS.ErrnoError(43)
				}
				stream.tty = tty;
				stream.seekable = false
			},
			close: function (stream) {
				stream.tty.ops.flush(stream.tty)
			},
			flush: function (stream) {
				stream.tty.ops.flush(stream.tty)
			},
			read: function (stream, buffer, offset, length, pos) {
				if (!stream.tty || !stream.tty.ops.get_char) {
					throw new FS.ErrnoError(60)
				}
				var bytesRead = 0;
				for (var i = 0; i < length; i++) {
					var result;
					try {
						result = stream.tty.ops.get_char(stream.tty)
					} catch (e) {
						throw new FS.ErrnoError(29)
					}
					if (result === undefined && bytesRead === 0) {
						throw new FS.ErrnoError(6)
					}
					if (result === null || result === undefined) break;
					bytesRead++;
					buffer[offset + i] = result
				}
				if (bytesRead) {
					stream.node.timestamp = Date.now()
				}
				return bytesRead
			},
			write: function (stream, buffer, offset, length, pos) {
				if (!stream.tty || !stream.tty.ops.put_char) {
					throw new FS.ErrnoError(60)
				}
				try {
					for (var i = 0; i < length; i++) {
						stream.tty.ops.put_char(stream.tty, buffer[offset + i])
					}
				} catch (e) {
					throw new FS.ErrnoError(29)
				}
				if (length) {
					stream.node.timestamp = Date.now()
				}
				return i
			}
		},
		default_tty_ops: {
			get_char: function (tty) {
				if (!tty.input.length) {
					var result = null;
					if (typeof window != "undefined" && typeof window.prompt == "function") {
						result = window.prompt("Input: ");
						if (result !== null) {
							result += "\n"
						}
					} else if (typeof readline == "function") {
						result = readline();
						if (result !== null) {
							result += "\n"
						}
					}
					if (!result) {
						return null
					}
					tty.input = intArrayFromString(result, true)
				}
				return tty.input.shift()
			},
			put_char: function (tty, val) {
				if (val === null || val === 10) {
					out(UTF8ArrayToString(tty.output, 0));
					tty.output = []
				} else {
					if (val != 0) tty.output.push(val)
				}
			},
			flush: function (tty) {
				if (tty.output && tty.output.length > 0) {
					out(UTF8ArrayToString(tty.output, 0));
					tty.output = []
				}
			}
		},
		default_tty1_ops: {
			put_char: function (tty, val) {
				if (val === null || val === 10) {
					err(UTF8ArrayToString(tty.output, 0));
					tty.output = []
				} else {
					if (val != 0) tty.output.push(val)
				}
			},
			flush: function (tty) {
				if (tty.output && tty.output.length > 0) {
					err(UTF8ArrayToString(tty.output, 0));
					tty.output = []
				}
			}
		}
	};

	function zeroMemory(address, size) {
		HEAPU8.fill(0, address, address + size)
	}

	function alignMemory(size, alignment) {
		return Math.ceil(size / alignment) * alignment
	}

	function mmapAlloc(size) {
		size = alignMemory(size, 65536);
		var ptr = _emscripten_builtin_memalign(65536, size);
		if (!ptr) return 0;
		zeroMemory(ptr, size);
		return ptr
	}
	var MEMFS = {
		ops_table: null,
		mount: function (mount) {
			return MEMFS.createNode(null, "/", 16384 | 511, 0)
		},
		createNode: function (parent, name, mode, dev) {
			if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
				throw new FS.ErrnoError(63)
			}
			if (!MEMFS.ops_table) {
				MEMFS.ops_table = {
					dir: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr,
							lookup: MEMFS.node_ops.lookup,
							mknod: MEMFS.node_ops.mknod,
							rename: MEMFS.node_ops.rename,
							unlink: MEMFS.node_ops.unlink,
							rmdir: MEMFS.node_ops.rmdir,
							readdir: MEMFS.node_ops.readdir,
							symlink: MEMFS.node_ops.symlink
						},
						stream: {
							llseek: MEMFS.stream_ops.llseek
						}
					},
					file: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr
						},
						stream: {
							llseek: MEMFS.stream_ops.llseek,
							read: MEMFS.stream_ops.read,
							write: MEMFS.stream_ops.write,
							allocate: MEMFS.stream_ops.allocate,
							mmap: MEMFS.stream_ops.mmap,
							msync: MEMFS.stream_ops.msync
						}
					},
					link: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr,
							readlink: MEMFS.node_ops.readlink
						},
						stream: {}
					},
					chrdev: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr
						},
						stream: FS.chrdev_stream_ops
					}
				}
			}
			var node = FS.createNode(parent, name, mode, dev);
			if (FS.isDir(node.mode)) {
				node.node_ops = MEMFS.ops_table.dir.node;
				node.stream_ops = MEMFS.ops_table.dir.stream;
				node.contents = {}
			} else if (FS.isFile(node.mode)) {
				node.node_ops = MEMFS.ops_table.file.node;
				node.stream_ops = MEMFS.ops_table.file.stream;
				node.usedBytes = 0;
				node.contents = null
			} else if (FS.isLink(node.mode)) {
				node.node_ops = MEMFS.ops_table.link.node;
				node.stream_ops = MEMFS.ops_table.link.stream
			} else if (FS.isChrdev(node.mode)) {
				node.node_ops = MEMFS.ops_table.chrdev.node;
				node.stream_ops = MEMFS.ops_table.chrdev.stream
			}
			node.timestamp = Date.now();
			if (parent) {
				parent.contents[name] = node;
				parent.timestamp = node.timestamp
			}
			return node
		},
		getFileDataAsTypedArray: function (node) {
			if (!node.contents) return new Uint8Array(0);
			if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
			return new Uint8Array(node.contents)
		},
		expandFileStorage: function (node, newCapacity) {
			var prevCapacity = node.contents ? node.contents.length : 0;
			if (prevCapacity >= newCapacity) return;
			var CAPACITY_DOUBLING_MAX = 1024 * 1024;
			newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
			if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
			var oldContents = node.contents;
			node.contents = new Uint8Array(newCapacity);
			if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0)
		},
		resizeFileStorage: function (node, newSize) {
			if (node.usedBytes == newSize) return;
			if (newSize == 0) {
				node.contents = null;
				node.usedBytes = 0
			} else {
				var oldContents = node.contents;
				node.contents = new Uint8Array(newSize);
				if (oldContents) {
					node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
				}
				node.usedBytes = newSize
			}
		},
		node_ops: {
			getattr: function (node) {
				var attr = {};
				attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
				attr.ino = node.id;
				attr.mode = node.mode;
				attr.nlink = 1;
				attr.uid = 0;
				attr.gid = 0;
				attr.rdev = node.rdev;
				if (FS.isDir(node.mode)) {
					attr.size = 4096
				} else if (FS.isFile(node.mode)) {
					attr.size = node.usedBytes
				} else if (FS.isLink(node.mode)) {
					attr.size = node.link.length
				} else {
					attr.size = 0
				}
				attr.atime = new Date(node.timestamp);
				attr.mtime = new Date(node.timestamp);
				attr.ctime = new Date(node.timestamp);
				attr.blksize = 4096;
				attr.blocks = Math.ceil(attr.size / attr.blksize);
				return attr
			},
			setattr: function (node, attr) {
				if (attr.mode !== undefined) {
					node.mode = attr.mode
				}
				if (attr.timestamp !== undefined) {
					node.timestamp = attr.timestamp
				}
				if (attr.size !== undefined) {
					MEMFS.resizeFileStorage(node, attr.size)
				}
			},
			lookup: function (parent, name) {
				throw FS.genericErrors[44]
			},
			mknod: function (parent, name, mode, dev) {
				return MEMFS.createNode(parent, name, mode, dev)
			},
			rename: function (old_node, new_dir, new_name) {
				if (FS.isDir(old_node.mode)) {
					var new_node;
					try {
						new_node = FS.lookupNode(new_dir, new_name)
					} catch (e) {}
					if (new_node) {
						for (var i in new_node.contents) {
							throw new FS.ErrnoError(55)
						}
					}
				}
				delete old_node.parent.contents[old_node.name];
				old_node.parent.timestamp = Date.now();
				old_node.name = new_name;
				new_dir.contents[new_name] = old_node;
				new_dir.timestamp = old_node.parent.timestamp;
				old_node.parent = new_dir
			},
			unlink: function (parent, name) {
				delete parent.contents[name];
				parent.timestamp = Date.now()
			},
			rmdir: function (parent, name) {
				var node = FS.lookupNode(parent, name);
				for (var i in node.contents) {
					throw new FS.ErrnoError(55)
				}
				delete parent.contents[name];
				parent.timestamp = Date.now()
			},
			readdir: function (node) {
				var entries = [".", ".."];
				for (var key in node.contents) {
					if (!node.contents.hasOwnProperty(key)) {
						continue
					}
					entries.push(key)
				}
				return entries
			},
			symlink: function (parent, newname, oldpath) {
				var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
				node.link = oldpath;
				return node
			},
			readlink: function (node) {
				if (!FS.isLink(node.mode)) {
					throw new FS.ErrnoError(28)
				}
				return node.link
			}
		},
		stream_ops: {
			read: function (stream, buffer, offset, length, position) {
				var contents = stream.node.contents;
				if (position >= stream.node.usedBytes) return 0;
				var size = Math.min(stream.node.usedBytes - position, length);
				if (size > 8 && contents.subarray) {
					buffer.set(contents.subarray(position, position + size), offset)
				} else {
					for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
				}
				return size
			},
			write: function (stream, buffer, offset, length, position, canOwn) {
				if (buffer.buffer === HEAP8.buffer) {
					canOwn = false
				}
				if (!length) return 0;
				var node = stream.node;
				node.timestamp = Date.now();
				if (buffer.subarray && (!node.contents || node.contents.subarray)) {
					if (canOwn) {
						node.contents = buffer.subarray(offset, offset + length);
						node.usedBytes = length;
						return length
					} else if (node.usedBytes === 0 && position === 0) {
						node.contents = buffer.slice(offset, offset + length);
						node.usedBytes = length;
						return length
					} else if (position + length <= node.usedBytes) {
						node.contents.set(buffer.subarray(offset, offset + length), position);
						return length
					}
				}
				MEMFS.expandFileStorage(node, position + length);
				if (node.contents.subarray && buffer.subarray) {
					node.contents.set(buffer.subarray(offset, offset + length), position)
				} else {
					for (var i = 0; i < length; i++) {
						node.contents[position + i] = buffer[offset + i]
					}
				}
				node.usedBytes = Math.max(node.usedBytes, position + length);
				return length
			},
			llseek: function (stream, offset, whence) {
				var position = offset;
				if (whence === 1) {
					position += stream.position
				} else if (whence === 2) {
					if (FS.isFile(stream.node.mode)) {
						position += stream.node.usedBytes
					}
				}
				if (position < 0) {
					throw new FS.ErrnoError(28)
				}
				return position
			},
			allocate: function (stream, offset, length) {
				MEMFS.expandFileStorage(stream.node, offset + length);
				stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
			},
			mmap: function (stream, length, position, prot, flags) {
				if (!FS.isFile(stream.node.mode)) {
					throw new FS.ErrnoError(43)
				}
				var ptr;
				var allocated;
				var contents = stream.node.contents;
				if (!(flags & 2) && contents.buffer === buffer) {
					allocated = false;
					ptr = contents.byteOffset
				} else {
					if (position > 0 || position + length < contents.length) {
						if (contents.subarray) {
							contents = contents.subarray(position, position + length)
						} else {
							contents = Array.prototype.slice.call(contents, position, position + length)
						}
					}
					allocated = true;
					ptr = mmapAlloc(length);
					if (!ptr) {
						throw new FS.ErrnoError(48)
					}
					HEAP8.set(contents, ptr)
				}
				return {
					ptr: ptr,
					allocated: allocated
				}
			},
			msync: function (stream, buffer, offset, length, mmapFlags) {
				if (!FS.isFile(stream.node.mode)) {
					throw new FS.ErrnoError(43)
				}
				if (mmapFlags & 2) {
					return 0
				}
				var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
				return 0
			}
		}
	};

	function asyncLoad(url, onload, onerror, noRunDep) {
		var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
		readAsync(url, function (arrayBuffer) {
			assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
			onload(new Uint8Array(arrayBuffer));
			if (dep) removeRunDependency(dep)
		}, function (event) {
			if (onerror) {
				onerror()
			} else {
				throw 'Loading data file "' + url + '" failed.'
			}
		});
		if (dep) addRunDependency(dep)
	}
	var FS = {
		root: null,
		mounts: [],
		devices: {},
		streams: [],
		nextInode: 1,
		nameTable: null,
		currentPath: "/",
		initialized: false,
		ignorePermissions: true,
		ErrnoError: null,
		genericErrors: {},
		filesystems: null,
		syncFSRequests: 0,
		lookupPath: (path, opts = {}) => {
			path = PATH_FS.resolve(FS.cwd(), path);
			if (!path) return {
				path: "",
				node: null
			};
			var defaults = {
				follow_mount: true,
				recurse_count: 0
			};
			opts = Object.assign(defaults, opts);
			if (opts.recurse_count > 8) {
				throw new FS.ErrnoError(32)
			}
			var parts = PATH.normalizeArray(path.split("/").filter(p => !!p), false);
			var current = FS.root;
			var current_path = "/";
			for (var i = 0; i < parts.length; i++) {
				var islast = i === parts.length - 1;
				if (islast && opts.parent) {
					break
				}
				current = FS.lookupNode(current, parts[i]);
				current_path = PATH.join2(current_path, parts[i]);
				if (FS.isMountpoint(current)) {
					if (!islast || islast && opts.follow_mount) {
						current = current.mounted.root
					}
				}
				if (!islast || opts.follow) {
					var count = 0;
					while (FS.isLink(current.mode)) {
						var link = FS.readlink(current_path);
						current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
						var lookup = FS.lookupPath(current_path, {
							recurse_count: opts.recurse_count + 1
						});
						current = lookup.node;
						if (count++ > 40) {
							throw new FS.ErrnoError(32)
						}
					}
				}
			}
			return {
				path: current_path,
				node: current
			}
		},
		getPath: node => {
			var path;
			while (true) {
				if (FS.isRoot(node)) {
					var mount = node.mount.mountpoint;
					if (!path) return mount;
					return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
				}
				path = path ? node.name + "/" + path : node.name;
				node = node.parent
			}
		},
		hashName: (parentid, name) => {
			var hash = 0;
			for (var i = 0; i < name.length; i++) {
				hash = (hash << 5) - hash + name.charCodeAt(i) | 0
			}
			return (parentid + hash >>> 0) % FS.nameTable.length
		},
		hashAddNode: node => {
			var hash = FS.hashName(node.parent.id, node.name);
			node.name_next = FS.nameTable[hash];
			FS.nameTable[hash] = node
		},
		hashRemoveNode: node => {
			var hash = FS.hashName(node.parent.id, node.name);
			if (FS.nameTable[hash] === node) {
				FS.nameTable[hash] = node.name_next
			} else {
				var current = FS.nameTable[hash];
				while (current) {
					if (current.name_next === node) {
						current.name_next = node.name_next;
						break
					}
					current = current.name_next
				}
			}
		},
		lookupNode: (parent, name) => {
			var errCode = FS.mayLookup(parent);
			if (errCode) {
				throw new FS.ErrnoError(errCode, parent)
			}
			var hash = FS.hashName(parent.id, name);
			for (var node = FS.nameTable[hash]; node; node = node.name_next) {
				var nodeName = node.name;
				if (node.parent.id === parent.id && nodeName === name) {
					return node
				}
			}
			return FS.lookup(parent, name)
		},
		createNode: (parent, name, mode, rdev) => {
			var node = new FS.FSNode(parent, name, mode, rdev);
			FS.hashAddNode(node);
			return node
		},
		destroyNode: node => {
			FS.hashRemoveNode(node)
		},
		isRoot: node => {
			return node === node.parent
		},
		isMountpoint: node => {
			return !!node.mounted
		},
		isFile: mode => {
			return (mode & 61440) === 32768
		},
		isDir: mode => {
			return (mode & 61440) === 16384
		},
		isLink: mode => {
			return (mode & 61440) === 40960
		},
		isChrdev: mode => {
			return (mode & 61440) === 8192
		},
		isBlkdev: mode => {
			return (mode & 61440) === 24576
		},
		isFIFO: mode => {
			return (mode & 61440) === 4096
		},
		isSocket: mode => {
			return (mode & 49152) === 49152
		},
		flagModes: {
			"r": 0,
			"r+": 2,
			"w": 577,
			"w+": 578,
			"a": 1089,
			"a+": 1090
		},
		modeStringToFlags: str => {
			var flags = FS.flagModes[str];
			if (typeof flags == "undefined") {
				throw new Error("Unknown file open mode: " + str)
			}
			return flags
		},
		flagsToPermissionString: flag => {
			var perms = ["r", "w", "rw"][flag & 3];
			if (flag & 512) {
				perms += "w"
			}
			return perms
		},
		nodePermissions: (node, perms) => {
			if (FS.ignorePermissions) {
				return 0
			}
			if (perms.includes("r") && !(node.mode & 292)) {
				return 2
			} else if (perms.includes("w") && !(node.mode & 146)) {
				return 2
			} else if (perms.includes("x") && !(node.mode & 73)) {
				return 2
			}
			return 0
		},
		mayLookup: dir => {
			var errCode = FS.nodePermissions(dir, "x");
			if (errCode) return errCode;
			if (!dir.node_ops.lookup) return 2;
			return 0
		},
		mayCreate: (dir, name) => {
			try {
				var node = FS.lookupNode(dir, name);
				return 20
			} catch (e) {}
			return FS.nodePermissions(dir, "wx")
		},
		mayDelete: (dir, name, isdir) => {
			var node;
			try {
				node = FS.lookupNode(dir, name)
			} catch (e) {
				return e.errno
			}
			var errCode = FS.nodePermissions(dir, "wx");
			if (errCode) {
				return errCode
			}
			if (isdir) {
				if (!FS.isDir(node.mode)) {
					return 54
				}
				if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
					return 10
				}
			} else {
				if (FS.isDir(node.mode)) {
					return 31
				}
			}
			return 0
		},
		mayOpen: (node, flags) => {
			if (!node) {
				return 44
			}
			if (FS.isLink(node.mode)) {
				return 32
			} else if (FS.isDir(node.mode)) {
				if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
					return 31
				}
			}
			return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
		},
		MAX_OPEN_FDS: 4096,
		nextfd: (fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
			for (var fd = fd_start; fd <= fd_end; fd++) {
				if (!FS.streams[fd]) {
					return fd
				}
			}
			throw new FS.ErrnoError(33)
		},
		getStream: fd => FS.streams[fd],
		createStream: (stream, fd_start, fd_end) => {
			if (!FS.FSStream) {
				FS.FSStream = function () {
					this.shared = {}
				};
				FS.FSStream.prototype = {};
				Object.defineProperties(FS.FSStream.prototype, {
					object: {
						get: function () {
							return this.node
						},
						set: function (val) {
							this.node = val
						}
					},
					isRead: {
						get: function () {
							return (this.flags & 2097155) !== 1
						}
					},
					isWrite: {
						get: function () {
							return (this.flags & 2097155) !== 0
						}
					},
					isAppend: {
						get: function () {
							return this.flags & 1024
						}
					},
					flags: {
						get: function () {
							return this.shared.flags
						},
						set: function (val) {
							this.shared.flags = val
						}
					},
					position: {
						get: function () {
							return this.shared.position
						},
						set: function (val) {
							this.shared.position = val
						}
					}
				})
			}
			stream = Object.assign(new FS.FSStream, stream);
			var fd = FS.nextfd(fd_start, fd_end);
			stream.fd = fd;
			FS.streams[fd] = stream;
			return stream
		},
		closeStream: fd => {
			FS.streams[fd] = null
		},
		chrdev_stream_ops: {
			open: stream => {
				var device = FS.getDevice(stream.node.rdev);
				stream.stream_ops = device.stream_ops;
				if (stream.stream_ops.open) {
					stream.stream_ops.open(stream)
				}
			},
			llseek: () => {
				throw new FS.ErrnoError(70)
			}
		},
		major: dev => dev >> 8,
		minor: dev => dev & 255,
		makedev: (ma, mi) => ma << 8 | mi,
		registerDevice: (dev, ops) => {
			FS.devices[dev] = {
				stream_ops: ops
			}
		},
		getDevice: dev => FS.devices[dev],
		getMounts: mount => {
			var mounts = [];
			var check = [mount];
			while (check.length) {
				var m = check.pop();
				mounts.push(m);
				check.push.apply(check, m.mounts)
			}
			return mounts
		},
		syncfs: (populate, callback) => {
			if (typeof populate == "function") {
				callback = populate;
				populate = false
			}
			FS.syncFSRequests++;
			if (FS.syncFSRequests > 1) {
				err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
			}
			var mounts = FS.getMounts(FS.root.mount);
			var completed = 0;

			function doCallback(errCode) {
				FS.syncFSRequests--;
				return callback(errCode)
			}

			function done(errCode) {
				if (errCode) {
					if (!done.errored) {
						done.errored = true;
						return doCallback(errCode)
					}
					return
				}
				if (++completed >= mounts.length) {
					doCallback(null)
				}
			}
			mounts.forEach(mount => {
				if (!mount.type.syncfs) {
					return done(null)
				}
				mount.type.syncfs(mount, populate, done)
			})
		},
		mount: (type, opts, mountpoint) => {
			var root = mountpoint === "/";
			var pseudo = !mountpoint;
			var node;
			if (root && FS.root) {
				throw new FS.ErrnoError(10)
			} else if (!root && !pseudo) {
				var lookup = FS.lookupPath(mountpoint, {
					follow_mount: false
				});
				mountpoint = lookup.path;
				node = lookup.node;
				if (FS.isMountpoint(node)) {
					throw new FS.ErrnoError(10)
				}
				if (!FS.isDir(node.mode)) {
					throw new FS.ErrnoError(54)
				}
			}
			var mount = {
				type: type,
				opts: opts,
				mountpoint: mountpoint,
				mounts: []
			};
			var mountRoot = type.mount(mount);
			mountRoot.mount = mount;
			mount.root = mountRoot;
			if (root) {
				FS.root = mountRoot
			} else if (node) {
				node.mounted = mount;
				if (node.mount) {
					node.mount.mounts.push(mount)
				}
			}
			return mountRoot
		},
		unmount: mountpoint => {
			var lookup = FS.lookupPath(mountpoint, {
				follow_mount: false
			});
			if (!FS.isMountpoint(lookup.node)) {
				throw new FS.ErrnoError(28)
			}
			var node = lookup.node;
			var mount = node.mounted;
			var mounts = FS.getMounts(mount);
			Object.keys(FS.nameTable).forEach(hash => {
				var current = FS.nameTable[hash];
				while (current) {
					var next = current.name_next;
					if (mounts.includes(current.mount)) {
						FS.destroyNode(current)
					}
					current = next
				}
			});
			node.mounted = null;
			var idx = node.mount.mounts.indexOf(mount);
			node.mount.mounts.splice(idx, 1)
		},
		lookup: (parent, name) => {
			return parent.node_ops.lookup(parent, name)
		},
		mknod: (path, mode, dev) => {
			var lookup = FS.lookupPath(path, {
				parent: true
			});
			var parent = lookup.node;
			var name = PATH.basename(path);
			if (!name || name === "." || name === "..") {
				throw new FS.ErrnoError(28)
			}
			var errCode = FS.mayCreate(parent, name);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!parent.node_ops.mknod) {
				throw new FS.ErrnoError(63)
			}
			return parent.node_ops.mknod(parent, name, mode, dev)
		},
		create: (path, mode) => {
			mode = mode !== undefined ? mode : 438;
			mode &= 4095;
			mode |= 32768;
			return FS.mknod(path, mode, 0)
		},
		mkdir: (path, mode) => {
			mode = mode !== undefined ? mode : 511;
			mode &= 511 | 512;
			mode |= 16384;
			return FS.mknod(path, mode, 0)
		},
		mkdirTree: (path, mode) => {
			var dirs = path.split("/");
			var d = "";
			for (var i = 0; i < dirs.length; ++i) {
				if (!dirs[i]) continue;
				d += "/" + dirs[i];
				try {
					FS.mkdir(d, mode)
				} catch (e) {
					if (e.errno != 20) throw e
				}
			}
		},
		mkdev: (path, mode, dev) => {
			if (typeof dev == "undefined") {
				dev = mode;
				mode = 438
			}
			mode |= 8192;
			return FS.mknod(path, mode, dev)
		},
		symlink: (oldpath, newpath) => {
			if (!PATH_FS.resolve(oldpath)) {
				throw new FS.ErrnoError(44)
			}
			var lookup = FS.lookupPath(newpath, {
				parent: true
			});
			var parent = lookup.node;
			if (!parent) {
				throw new FS.ErrnoError(44)
			}
			var newname = PATH.basename(newpath);
			var errCode = FS.mayCreate(parent, newname);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!parent.node_ops.symlink) {
				throw new FS.ErrnoError(63)
			}
			return parent.node_ops.symlink(parent, newname, oldpath)
		},
		rename: (old_path, new_path) => {
			var old_dirname = PATH.dirname(old_path);
			var new_dirname = PATH.dirname(new_path);
			var old_name = PATH.basename(old_path);
			var new_name = PATH.basename(new_path);
			var lookup, old_dir, new_dir;
			lookup = FS.lookupPath(old_path, {
				parent: true
			});
			old_dir = lookup.node;
			lookup = FS.lookupPath(new_path, {
				parent: true
			});
			new_dir = lookup.node;
			if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
			if (old_dir.mount !== new_dir.mount) {
				throw new FS.ErrnoError(75)
			}
			var old_node = FS.lookupNode(old_dir, old_name);
			var relative = PATH_FS.relative(old_path, new_dirname);
			if (relative.charAt(0) !== ".") {
				throw new FS.ErrnoError(28)
			}
			relative = PATH_FS.relative(new_path, old_dirname);
			if (relative.charAt(0) !== ".") {
				throw new FS.ErrnoError(55)
			}
			var new_node;
			try {
				new_node = FS.lookupNode(new_dir, new_name)
			} catch (e) {}
			if (old_node === new_node) {
				return
			}
			var isdir = FS.isDir(old_node.mode);
			var errCode = FS.mayDelete(old_dir, old_name, isdir);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!old_dir.node_ops.rename) {
				throw new FS.ErrnoError(63)
			}
			if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
				throw new FS.ErrnoError(10)
			}
			if (new_dir !== old_dir) {
				errCode = FS.nodePermissions(old_dir, "w");
				if (errCode) {
					throw new FS.ErrnoError(errCode)
				}
			}
			FS.hashRemoveNode(old_node);
			try {
				old_dir.node_ops.rename(old_node, new_dir, new_name)
			} catch (e) {
				throw e
			} finally {
				FS.hashAddNode(old_node)
			}
		},
		rmdir: path => {
			var lookup = FS.lookupPath(path, {
				parent: true
			});
			var parent = lookup.node;
			var name = PATH.basename(path);
			var node = FS.lookupNode(parent, name);
			var errCode = FS.mayDelete(parent, name, true);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!parent.node_ops.rmdir) {
				throw new FS.ErrnoError(63)
			}
			if (FS.isMountpoint(node)) {
				throw new FS.ErrnoError(10)
			}
			parent.node_ops.rmdir(parent, name);
			FS.destroyNode(node)
		},
		readdir: path => {
			var lookup = FS.lookupPath(path, {
				follow: true
			});
			var node = lookup.node;
			if (!node.node_ops.readdir) {
				throw new FS.ErrnoError(54)
			}
			return node.node_ops.readdir(node)
		},
		unlink: path => {
			var lookup = FS.lookupPath(path, {
				parent: true
			});
			var parent = lookup.node;
			if (!parent) {
				throw new FS.ErrnoError(44)
			}
			var name = PATH.basename(path);
			var node = FS.lookupNode(parent, name);
			var errCode = FS.mayDelete(parent, name, false);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!parent.node_ops.unlink) {
				throw new FS.ErrnoError(63)
			}
			if (FS.isMountpoint(node)) {
				throw new FS.ErrnoError(10)
			}
			parent.node_ops.unlink(parent, name);
			FS.destroyNode(node)
		},
		readlink: path => {
			var lookup = FS.lookupPath(path);
			var link = lookup.node;
			if (!link) {
				throw new FS.ErrnoError(44)
			}
			if (!link.node_ops.readlink) {
				throw new FS.ErrnoError(28)
			}
			return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
		},
		stat: (path, dontFollow) => {
			var lookup = FS.lookupPath(path, {
				follow: !dontFollow
			});
			var node = lookup.node;
			if (!node) {
				throw new FS.ErrnoError(44)
			}
			if (!node.node_ops.getattr) {
				throw new FS.ErrnoError(63)
			}
			return node.node_ops.getattr(node)
		},
		lstat: path => {
			return FS.stat(path, true)
		},
		chmod: (path, mode, dontFollow) => {
			var node;
			if (typeof path == "string") {
				var lookup = FS.lookupPath(path, {
					follow: !dontFollow
				});
				node = lookup.node
			} else {
				node = path
			}
			if (!node.node_ops.setattr) {
				throw new FS.ErrnoError(63)
			}
			node.node_ops.setattr(node, {
				mode: mode & 4095 | node.mode & ~4095,
				timestamp: Date.now()
			})
		},
		lchmod: (path, mode) => {
			FS.chmod(path, mode, true)
		},
		fchmod: (fd, mode) => {
			var stream = FS.getStream(fd);
			if (!stream) {
				throw new FS.ErrnoError(8)
			}
			FS.chmod(stream.node, mode)
		},
		chown: (path, uid, gid, dontFollow) => {
			var node;
			if (typeof path == "string") {
				var lookup = FS.lookupPath(path, {
					follow: !dontFollow
				});
				node = lookup.node
			} else {
				node = path
			}
			if (!node.node_ops.setattr) {
				throw new FS.ErrnoError(63)
			}
			node.node_ops.setattr(node, {
				timestamp: Date.now()
			})
		},
		lchown: (path, uid, gid) => {
			FS.chown(path, uid, gid, true)
		},
		fchown: (fd, uid, gid) => {
			var stream = FS.getStream(fd);
			if (!stream) {
				throw new FS.ErrnoError(8)
			}
			FS.chown(stream.node, uid, gid)
		},
		truncate: (path, len) => {
			if (len < 0) {
				throw new FS.ErrnoError(28)
			}
			var node;
			if (typeof path == "string") {
				var lookup = FS.lookupPath(path, {
					follow: true
				});
				node = lookup.node
			} else {
				node = path
			}
			if (!node.node_ops.setattr) {
				throw new FS.ErrnoError(63)
			}
			if (FS.isDir(node.mode)) {
				throw new FS.ErrnoError(31)
			}
			if (!FS.isFile(node.mode)) {
				throw new FS.ErrnoError(28)
			}
			var errCode = FS.nodePermissions(node, "w");
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			node.node_ops.setattr(node, {
				size: len,
				timestamp: Date.now()
			})
		},
		ftruncate: (fd, len) => {
			var stream = FS.getStream(fd);
			if (!stream) {
				throw new FS.ErrnoError(8)
			}
			if ((stream.flags & 2097155) === 0) {
				throw new FS.ErrnoError(28)
			}
			FS.truncate(stream.node, len)
		},
		utime: (path, atime, mtime) => {
			var lookup = FS.lookupPath(path, {
				follow: true
			});
			var node = lookup.node;
			node.node_ops.setattr(node, {
				timestamp: Math.max(atime, mtime)
			})
		},
		open: (path, flags, mode) => {
			if (path === "") {
				throw new FS.ErrnoError(44)
			}
			flags = typeof flags == "string" ? FS.modeStringToFlags(flags) : flags;
			mode = typeof mode == "undefined" ? 438 : mode;
			if (flags & 64) {
				mode = mode & 4095 | 32768
			} else {
				mode = 0
			}
			var node;
			if (typeof path == "object") {
				node = path
			} else {
				path = PATH.normalize(path);
				try {
					var lookup = FS.lookupPath(path, {
						follow: !(flags & 131072)
					});
					node = lookup.node
				} catch (e) {}
			}
			var created = false;
			if (flags & 64) {
				if (node) {
					if (flags & 128) {
						throw new FS.ErrnoError(20)
					}
				} else {
					node = FS.mknod(path, mode, 0);
					created = true
				}
			}
			if (!node) {
				throw new FS.ErrnoError(44)
			}
			if (FS.isChrdev(node.mode)) {
				flags &= ~512
			}
			if (flags & 65536 && !FS.isDir(node.mode)) {
				throw new FS.ErrnoError(54)
			}
			if (!created) {
				var errCode = FS.mayOpen(node, flags);
				if (errCode) {
					throw new FS.ErrnoError(errCode)
				}
			}
			if (flags & 512 && !created) {
				FS.truncate(node, 0)
			}
			flags &= ~(128 | 512 | 131072);
			var stream = FS.createStream({
				node: node,
				path: FS.getPath(node),
				flags: flags,
				seekable: true,
				position: 0,
				stream_ops: node.stream_ops,
				ungotten: [],
				error: false
			});
			if (stream.stream_ops.open) {
				stream.stream_ops.open(stream)
			}
			if (Module["logReadFiles"] && !(flags & 1)) {
				if (!FS.readFiles) FS.readFiles = {};
				if (!(path in FS.readFiles)) {
					FS.readFiles[path] = 1
				}
			}
			return stream
		},
		close: stream => {
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if (stream.getdents) stream.getdents = null;
			try {
				if (stream.stream_ops.close) {
					stream.stream_ops.close(stream)
				}
			} catch (e) {
				throw e
			} finally {
				FS.closeStream(stream.fd)
			}
			stream.fd = null
		},
		isClosed: stream => {
			return stream.fd === null
		},
		llseek: (stream, offset, whence) => {
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if (!stream.seekable || !stream.stream_ops.llseek) {
				throw new FS.ErrnoError(70)
			}
			if (whence != 0 && whence != 1 && whence != 2) {
				throw new FS.ErrnoError(28)
			}
			stream.position = stream.stream_ops.llseek(stream, offset, whence);
			stream.ungotten = [];
			return stream.position
		},
		read: (stream, buffer, offset, length, position) => {
			if (length < 0 || position < 0) {
				throw new FS.ErrnoError(28)
			}
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if ((stream.flags & 2097155) === 1) {
				throw new FS.ErrnoError(8)
			}
			if (FS.isDir(stream.node.mode)) {
				throw new FS.ErrnoError(31)
			}
			if (!stream.stream_ops.read) {
				throw new FS.ErrnoError(28)
			}
			var seeking = typeof position != "undefined";
			if (!seeking) {
				position = stream.position
			} else if (!stream.seekable) {
				throw new FS.ErrnoError(70)
			}
			var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
			if (!seeking) stream.position += bytesRead;
			return bytesRead
		},
		write: (stream, buffer, offset, length, position, canOwn) => {
			if (length < 0 || position < 0) {
				throw new FS.ErrnoError(28)
			}
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if ((stream.flags & 2097155) === 0) {
				throw new FS.ErrnoError(8)
			}
			if (FS.isDir(stream.node.mode)) {
				throw new FS.ErrnoError(31)
			}
			if (!stream.stream_ops.write) {
				throw new FS.ErrnoError(28)
			}
			if (stream.seekable && stream.flags & 1024) {
				FS.llseek(stream, 0, 2)
			}
			var seeking = typeof position != "undefined";
			if (!seeking) {
				position = stream.position
			} else if (!stream.seekable) {
				throw new FS.ErrnoError(70)
			}
			var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
			if (!seeking) stream.position += bytesWritten;
			return bytesWritten
		},
		allocate: (stream, offset, length) => {
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if (offset < 0 || length <= 0) {
				throw new FS.ErrnoError(28)
			}
			if ((stream.flags & 2097155) === 0) {
				throw new FS.ErrnoError(8)
			}
			if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
				throw new FS.ErrnoError(43)
			}
			if (!stream.stream_ops.allocate) {
				throw new FS.ErrnoError(138)
			}
			stream.stream_ops.allocate(stream, offset, length)
		},
		mmap: (stream, length, position, prot, flags) => {
			if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
				throw new FS.ErrnoError(2)
			}
			if ((stream.flags & 2097155) === 1) {
				throw new FS.ErrnoError(2)
			}
			if (!stream.stream_ops.mmap) {
				throw new FS.ErrnoError(43)
			}
			return stream.stream_ops.mmap(stream, length, position, prot, flags)
		},
		msync: (stream, buffer, offset, length, mmapFlags) => {
			if (!stream || !stream.stream_ops.msync) {
				return 0
			}
			return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
		},
		munmap: stream => 0,
		ioctl: (stream, cmd, arg) => {
			if (!stream.stream_ops.ioctl) {
				throw new FS.ErrnoError(59)
			}
			return stream.stream_ops.ioctl(stream, cmd, arg)
		},
		readFile: (path, opts = {}) => {
			opts.flags = opts.flags || 0;
			opts.encoding = opts.encoding || "binary";
			if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
				throw new Error('Invalid encoding type "' + opts.encoding + '"')
			}
			var ret;
			var stream = FS.open(path, opts.flags);
			var stat = FS.stat(path);
			var length = stat.size;
			var buf = new Uint8Array(length);
			FS.read(stream, buf, 0, length, 0);
			if (opts.encoding === "utf8") {
				ret = UTF8ArrayToString(buf, 0)
			} else if (opts.encoding === "binary") {
				ret = buf
			}
			FS.close(stream);
			return ret
		},
		writeFile: (path, data, opts = {}) => {
			opts.flags = opts.flags || 577;
			var stream = FS.open(path, opts.flags, opts.mode);
			if (typeof data == "string") {
				var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
				var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
				FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
			} else if (ArrayBuffer.isView(data)) {
				FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
			} else {
				throw new Error("Unsupported data type")
			}
			FS.close(stream)
		},
		cwd: () => FS.currentPath,
		chdir: path => {
			var lookup = FS.lookupPath(path, {
				follow: true
			});
			if (lookup.node === null) {
				throw new FS.ErrnoError(44)
			}
			if (!FS.isDir(lookup.node.mode)) {
				throw new FS.ErrnoError(54)
			}
			var errCode = FS.nodePermissions(lookup.node, "x");
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			FS.currentPath = lookup.path
		},
		createDefaultDirectories: () => {
			FS.mkdir("/tmp");
			FS.mkdir("/home");
			FS.mkdir("/home/web_user")
		},
		createDefaultDevices: () => {
			FS.mkdir("/dev");
			FS.registerDevice(FS.makedev(1, 3), {
				read: () => 0,
				write: (stream, buffer, offset, length, pos) => length
			});
			FS.mkdev("/dev/null", FS.makedev(1, 3));
			TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
			TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
			FS.mkdev("/dev/tty", FS.makedev(5, 0));
			FS.mkdev("/dev/tty1", FS.makedev(6, 0));
			var random_device = getRandomDevice();
			FS.createDevice("/dev", "random", random_device);
			FS.createDevice("/dev", "urandom", random_device);
			FS.mkdir("/dev/shm");
			FS.mkdir("/dev/shm/tmp")
		},
		createSpecialDirectories: () => {
			FS.mkdir("/proc");
			var proc_self = FS.mkdir("/proc/self");
			FS.mkdir("/proc/self/fd");
			FS.mount({
				mount: () => {
					var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
					node.node_ops = {
						lookup: (parent, name) => {
							var fd = +name;
							var stream = FS.getStream(fd);
							if (!stream) throw new FS.ErrnoError(8);
							var ret = {
								parent: null,
								mount: {
									mountpoint: "fake"
								},
								node_ops: {
									readlink: () => stream.path
								}
							};
							ret.parent = ret;
							return ret
						}
					};
					return node
				}
			}, {}, "/proc/self/fd")
		},
		createStandardStreams: () => {
			if (Module["stdin"]) {
				FS.createDevice("/dev", "stdin", Module["stdin"])
			} else {
				FS.symlink("/dev/tty", "/dev/stdin")
			}
			if (Module["stdout"]) {
				FS.createDevice("/dev", "stdout", null, Module["stdout"])
			} else {
				FS.symlink("/dev/tty", "/dev/stdout")
			}
			if (Module["stderr"]) {
				FS.createDevice("/dev", "stderr", null, Module["stderr"])
			} else {
				FS.symlink("/dev/tty1", "/dev/stderr")
			}
			var stdin = FS.open("/dev/stdin", 0);
			var stdout = FS.open("/dev/stdout", 1);
			var stderr = FS.open("/dev/stderr", 1)
		},
		ensureErrnoError: () => {
			if (FS.ErrnoError) return;
			FS.ErrnoError = function ErrnoError(errno, node) {
				this.node = node;
				this.setErrno = function (errno) {
					this.errno = errno
				};
				this.setErrno(errno);
				this.message = "FS error"
			};
			FS.ErrnoError.prototype = new Error;
			FS.ErrnoError.prototype.constructor = FS.ErrnoError;
			[44].forEach(code => {
				FS.genericErrors[code] = new FS.ErrnoError(code);
				FS.genericErrors[code].stack = "<generic error, no stack>"
			})
		},
		staticInit: () => {
			FS.ensureErrnoError();
			FS.nameTable = new Array(4096);
			FS.mount(MEMFS, {}, "/");
			FS.createDefaultDirectories();
			FS.createDefaultDevices();
			FS.createSpecialDirectories();
			FS.filesystems = {
				"MEMFS": MEMFS
			}
		},
		init: (input, output, error) => {
			FS.init.initialized = true;
			FS.ensureErrnoError();
			Module["stdin"] = input || Module["stdin"];
			Module["stdout"] = output || Module["stdout"];
			Module["stderr"] = error || Module["stderr"];
			FS.createStandardStreams()
		},
		quit: () => {
			FS.init.initialized = false;
			for (var i = 0; i < FS.streams.length; i++) {
				var stream = FS.streams[i];
				if (!stream) {
					continue
				}
				FS.close(stream)
			}
		},
		getMode: (canRead, canWrite) => {
			var mode = 0;
			if (canRead) mode |= 292 | 73;
			if (canWrite) mode |= 146;
			return mode
		},
		findObject: (path, dontResolveLastLink) => {
			var ret = FS.analyzePath(path, dontResolveLastLink);
			if (ret.exists) {
				return ret.object
			} else {
				return null
			}
		},
		analyzePath: (path, dontResolveLastLink) => {
			try {
				var lookup = FS.lookupPath(path, {
					follow: !dontResolveLastLink
				});
				path = lookup.path
			} catch (e) {}
			var ret = {
				isRoot: false,
				exists: false,
				error: 0,
				name: null,
				path: null,
				object: null,
				parentExists: false,
				parentPath: null,
				parentObject: null
			};
			try {
				var lookup = FS.lookupPath(path, {
					parent: true
				});
				ret.parentExists = true;
				ret.parentPath = lookup.path;
				ret.parentObject = lookup.node;
				ret.name = PATH.basename(path);
				lookup = FS.lookupPath(path, {
					follow: !dontResolveLastLink
				});
				ret.exists = true;
				ret.path = lookup.path;
				ret.object = lookup.node;
				ret.name = lookup.node.name;
				ret.isRoot = lookup.path === "/"
			} catch (e) {
				ret.error = e.errno
			}
			return ret
		},
		createPath: (parent, path, canRead, canWrite) => {
			parent = typeof parent == "string" ? parent : FS.getPath(parent);
			var parts = path.split("/").reverse();
			while (parts.length) {
				var part = parts.pop();
				if (!part) continue;
				var current = PATH.join2(parent, part);
				try {
					FS.mkdir(current)
				} catch (e) {}
				parent = current
			}
			return current
		},
		createFile: (parent, name, properties, canRead, canWrite) => {
			var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
			var mode = FS.getMode(canRead, canWrite);
			return FS.create(path, mode)
		},
		createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
			var path = name;
			if (parent) {
				parent = typeof parent == "string" ? parent : FS.getPath(parent);
				path = name ? PATH.join2(parent, name) : parent
			}
			var mode = FS.getMode(canRead, canWrite);
			var node = FS.create(path, mode);
			if (data) {
				if (typeof data == "string") {
					var arr = new Array(data.length);
					for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
					data = arr
				}
				FS.chmod(node, mode | 146);
				var stream = FS.open(node, 577);
				FS.write(stream, data, 0, data.length, 0, canOwn);
				FS.close(stream);
				FS.chmod(node, mode)
			}
			return node
		},
		createDevice: (parent, name, input, output) => {
			var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
			var mode = FS.getMode(!!input, !!output);
			if (!FS.createDevice.major) FS.createDevice.major = 64;
			var dev = FS.makedev(FS.createDevice.major++, 0);
			FS.registerDevice(dev, {
				open: stream => {
					stream.seekable = false
				},
				close: stream => {
					if (output && output.buffer && output.buffer.length) {
						output(10)
					}
				},
				read: (stream, buffer, offset, length, pos) => {
					var bytesRead = 0;
					for (var i = 0; i < length; i++) {
						var result;
						try {
							result = input()
						} catch (e) {
							throw new FS.ErrnoError(29)
						}
						if (result === undefined && bytesRead === 0) {
							throw new FS.ErrnoError(6)
						}
						if (result === null || result === undefined) break;
						bytesRead++;
						buffer[offset + i] = result
					}
					if (bytesRead) {
						stream.node.timestamp = Date.now()
					}
					return bytesRead
				},
				write: (stream, buffer, offset, length, pos) => {
					for (var i = 0; i < length; i++) {
						try {
							output(buffer[offset + i])
						} catch (e) {
							throw new FS.ErrnoError(29)
						}
					}
					if (length) {
						stream.node.timestamp = Date.now()
					}
					return i
				}
			});
			return FS.mkdev(path, mode, dev)
		},
		forceLoadFile: obj => {
			if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
			if (typeof XMLHttpRequest != "undefined") {
				throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
			} else if (read_) {
				try {
					obj.contents = intArrayFromString(read_(obj.url), true);
					obj.usedBytes = obj.contents.length
				} catch (e) {
					throw new FS.ErrnoError(29)
				}
			} else {
				throw new Error("Cannot load without read() or XMLHttpRequest.")
			}
		},
		createLazyFile: (parent, name, url, canRead, canWrite) => {
			function LazyUint8Array() {
				this.lengthKnown = false;
				this.chunks = []
			}
			LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
				if (idx > this.length - 1 || idx < 0) {
					return undefined
				}
				var chunkOffset = idx % this.chunkSize;
				var chunkNum = idx / this.chunkSize | 0;
				return this.getter(chunkNum)[chunkOffset]
			};
			LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
				this.getter = getter
			};
			LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
				var xhr = new XMLHttpRequest;
				xhr.open("HEAD", url, false);
				xhr.send(null);
				if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
				var datalength = Number(xhr.getResponseHeader("Content-length"));
				var header;
				var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
				var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
				var chunkSize = 1024 * 1024;
				if (!hasByteServing) chunkSize = datalength;
				var doXHR = (from, to) => {
					if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
					if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
					var xhr = new XMLHttpRequest;
					xhr.open("GET", url, false);
					if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
					xhr.responseType = "arraybuffer";
					if (xhr.overrideMimeType) {
						xhr.overrideMimeType("text/plain; charset=x-user-defined")
					}
					xhr.send(null);
					if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
					if (xhr.response !== undefined) {
						return new Uint8Array(xhr.response || [])
					} else {
						return intArrayFromString(xhr.responseText || "", true)
					}
				};
				var lazyArray = this;
				lazyArray.setDataGetter(chunkNum => {
					var start = chunkNum * chunkSize;
					var end = (chunkNum + 1) * chunkSize - 1;
					end = Math.min(end, datalength - 1);
					if (typeof lazyArray.chunks[chunkNum] == "undefined") {
						lazyArray.chunks[chunkNum] = doXHR(start, end)
					}
					if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
					return lazyArray.chunks[chunkNum]
				});
				if (usesGzip || !datalength) {
					chunkSize = datalength = 1;
					datalength = this.getter(0).length;
					chunkSize = datalength;
					out("LazyFiles on gzip forces download of the whole file when length is accessed")
				}
				this._length = datalength;
				this._chunkSize = chunkSize;
				this.lengthKnown = true
			};
			if (typeof XMLHttpRequest != "undefined") {
				if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
				var lazyArray = new LazyUint8Array;
				Object.defineProperties(lazyArray, {
					length: {
						get: function () {
							if (!this.lengthKnown) {
								this.cacheLength()
							}
							return this._length
						}
					},
					chunkSize: {
						get: function () {
							if (!this.lengthKnown) {
								this.cacheLength()
							}
							return this._chunkSize
						}
					}
				});
				var properties = {
					isDevice: false,
					contents: lazyArray
				}
			} else {
				var properties = {
					isDevice: false,
					url: url
				}
			}
			var node = FS.createFile(parent, name, properties, canRead, canWrite);
			if (properties.contents) {
				node.contents = properties.contents
			} else if (properties.url) {
				node.contents = null;
				node.url = properties.url
			}
			Object.defineProperties(node, {
				usedBytes: {
					get: function () {
						return this.contents.length
					}
				}
			});
			var stream_ops = {};
			var keys = Object.keys(node.stream_ops);
			keys.forEach(key => {
				var fn = node.stream_ops[key];
				stream_ops[key] = function forceLoadLazyFile() {
					FS.forceLoadFile(node);
					return fn.apply(null, arguments)
				}
			});

			function writeChunks(stream, buffer, offset, length, position) {
				var contents = stream.node.contents;
				if (position >= contents.length) return 0;
				var size = Math.min(contents.length - position, length);
				if (contents.slice) {
					for (var i = 0; i < size; i++) {
						buffer[offset + i] = contents[position + i]
					}
				} else {
					for (var i = 0; i < size; i++) {
						buffer[offset + i] = contents.get(position + i)
					}
				}
				return size
			}
			stream_ops.read = (stream, buffer, offset, length, position) => {
				FS.forceLoadFile(node);
				return writeChunks(stream, buffer, offset, length, position)
			};
			stream_ops.mmap = (stream, length, position, prot, flags) => {
				FS.forceLoadFile(node);
				var ptr = mmapAlloc(length);
				if (!ptr) {
					throw new FS.ErrnoError(48)
				}
				writeChunks(stream, HEAP8, ptr, length, position);
				return {
					ptr: ptr,
					allocated: true
				}
			};
			node.stream_ops = stream_ops;
			return node
		},
		createPreloadedFile: (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
			var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
			var dep = getUniqueRunDependency("cp " + fullname);

			function processData(byteArray) {
				function finish(byteArray) {
					if (preFinish) preFinish();
					if (!dontCreateFile) {
						FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
					}
					if (onload) onload();
					removeRunDependency(dep)
				}
				if (Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
						if (onerror) onerror();
						removeRunDependency(dep)
					})) {
					return
				}
				finish(byteArray)
			}
			addRunDependency(dep);
			if (typeof url == "string") {
				asyncLoad(url, byteArray => processData(byteArray), onerror)
			} else {
				processData(url)
			}
		},
		indexedDB: () => {
			return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
		},
		DB_NAME: () => {
			return "EM_FS_" + window.location.pathname
		},
		DB_VERSION: 20,
		DB_STORE_NAME: "FILE_DATA",
		saveFilesToDB: (paths, onload, onerror) => {
			onload = onload || (() => {});
			onerror = onerror || (() => {});
			var indexedDB = FS.indexedDB();
			try {
				var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
			} catch (e) {
				return onerror(e)
			}
			openRequest.onupgradeneeded = () => {
				out("creating db");
				var db = openRequest.result;
				db.createObjectStore(FS.DB_STORE_NAME)
			};
			openRequest.onsuccess = () => {
				var db = openRequest.result;
				var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
				var files = transaction.objectStore(FS.DB_STORE_NAME);
				var ok = 0,
					fail = 0,
					total = paths.length;

				function finish() {
					if (fail == 0) onload();
					else onerror()
				}
				paths.forEach(path => {
					var putRequest = files.put(FS.analyzePath(path).object.contents, path);
					putRequest.onsuccess = () => {
						ok++;
						if (ok + fail == total) finish()
					};
					putRequest.onerror = () => {
						fail++;
						if (ok + fail == total) finish()
					}
				});
				transaction.onerror = onerror
			};
			openRequest.onerror = onerror
		},
		loadFilesFromDB: (paths, onload, onerror) => {
			onload = onload || (() => {});
			onerror = onerror || (() => {});
			var indexedDB = FS.indexedDB();
			try {
				var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
			} catch (e) {
				return onerror(e)
			}
			openRequest.onupgradeneeded = onerror;
			openRequest.onsuccess = () => {
				var db = openRequest.result;
				try {
					var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
				} catch (e) {
					onerror(e);
					return
				}
				var files = transaction.objectStore(FS.DB_STORE_NAME);
				var ok = 0,
					fail = 0,
					total = paths.length;

				function finish() {
					if (fail == 0) onload();
					else onerror()
				}
				paths.forEach(path => {
					var getRequest = files.get(path);
					getRequest.onsuccess = () => {
						if (FS.analyzePath(path).exists) {
							FS.unlink(path)
						}
						FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
						ok++;
						if (ok + fail == total) finish()
					};
					getRequest.onerror = () => {
						fail++;
						if (ok + fail == total) finish()
					}
				});
				transaction.onerror = onerror
			};
			openRequest.onerror = onerror
		}
	};
	var SYSCALLS = {
		DEFAULT_POLLMASK: 5,
		calculateAt: function (dirfd, path, allowEmpty) {
			if (PATH.isAbs(path)) {
				return path
			}
			var dir;
			if (dirfd === -100) {
				dir = FS.cwd()
			} else {
				var dirstream = FS.getStream(dirfd);
				if (!dirstream) throw new FS.ErrnoError(8);
				dir = dirstream.path
			}
			if (path.length == 0) {
				if (!allowEmpty) {
					throw new FS.ErrnoError(44)
				}
				return dir
			}
			return PATH.join2(dir, path)
		},
		doStat: function (func, path, buf) {
			try {
				var stat = func(path)
			} catch (e) {
				if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
					return -54
				}
				throw e
			}
			HEAP32[buf >> 2] = stat.dev;
			HEAP32[buf + 4 >> 2] = 0;
			HEAP32[buf + 8 >> 2] = stat.ino;
			HEAP32[buf + 12 >> 2] = stat.mode;
			HEAP32[buf + 16 >> 2] = stat.nlink;
			HEAP32[buf + 20 >> 2] = stat.uid;
			HEAP32[buf + 24 >> 2] = stat.gid;
			HEAP32[buf + 28 >> 2] = stat.rdev;
			HEAP32[buf + 32 >> 2] = 0;
			tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
			HEAP32[buf + 48 >> 2] = 4096;
			HEAP32[buf + 52 >> 2] = stat.blocks;
			HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
			HEAP32[buf + 60 >> 2] = 0;
			HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
			HEAP32[buf + 68 >> 2] = 0;
			HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
			HEAP32[buf + 76 >> 2] = 0;
			tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 80 >> 2] = tempI64[0], HEAP32[buf + 84 >> 2] = tempI64[1];
			return 0
		},
		doMsync: function (addr, stream, len, flags, offset) {
			var buffer = HEAPU8.slice(addr, addr + len);
			FS.msync(stream, buffer, offset, len, flags)
		},
		varargs: undefined,
		get: function () {
			SYSCALLS.varargs += 4;
			var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
			return ret
		},
		getStr: function (ptr) {
			var ret = UTF8ToString(ptr);
			return ret
		},
		getStreamFromFD: function (fd) {
			var stream = FS.getStream(fd);
			if (!stream) throw new FS.ErrnoError(8);
			return stream
		}
	};

	function ___syscall_chmod(path, mode) {
		try {
			path = SYSCALLS.getStr(path);
			FS.chmod(path, mode);
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_faccessat(dirfd, path, amode, flags) {
		try {
			path = SYSCALLS.getStr(path);
			path = SYSCALLS.calculateAt(dirfd, path);
			if (amode & ~7) {
				return -28
			}
			var lookup = FS.lookupPath(path, {
				follow: true
			});
			var node = lookup.node;
			if (!node) {
				return -44
			}
			var perms = "";
			if (amode & 4) perms += "r";
			if (amode & 2) perms += "w";
			if (amode & 1) perms += "x";
			if (perms && FS.nodePermissions(node, perms)) {
				return -2
			}
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function setErrNo(value) {
		HEAP32[___errno_location() >> 2] = value;
		return value
	}

	function ___syscall_fcntl64(fd, cmd, varargs) {
		SYSCALLS.varargs = varargs;
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			switch (cmd) {
				case 0: {
					var arg = SYSCALLS.get();
					if (arg < 0) {
						return -28
					}
					var newStream;
					newStream = FS.createStream(stream, arg);
					return newStream.fd
				}
				case 1:
				case 2:
					return 0;
				case 3:
					return stream.flags;
				case 4: {
					var arg = SYSCALLS.get();
					stream.flags |= arg;
					return 0
				}
				case 5: {
					var arg = SYSCALLS.get();
					var offset = 0;
					HEAP16[arg + offset >> 1] = 2;
					return 0
				}
				case 6:
				case 7:
					return 0;
				case 16:
				case 8:
					return -28;
				case 9:
					setErrNo(28);
					return -1;
				default: {
					return -28
				}
			}
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_fstat64(fd, buf) {
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			return SYSCALLS.doStat(FS.stat, stream.path, buf)
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_statfs64(path, size, buf) {
		try {
			path = SYSCALLS.getStr(path);
			HEAP32[buf + 4 >> 2] = 4096;
			HEAP32[buf + 40 >> 2] = 4096;
			HEAP32[buf + 8 >> 2] = 1e6;
			HEAP32[buf + 12 >> 2] = 5e5;
			HEAP32[buf + 16 >> 2] = 5e5;
			HEAP32[buf + 20 >> 2] = FS.nextInode;
			HEAP32[buf + 24 >> 2] = 1e6;
			HEAP32[buf + 28 >> 2] = 42;
			HEAP32[buf + 44 >> 2] = 2;
			HEAP32[buf + 36 >> 2] = 255;
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_fstatfs64(fd, size, buf) {
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			return ___syscall_statfs64(0, size, buf)
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_getcwd(buf, size) {
		try {
			if (size === 0) return -28;
			var cwd = FS.cwd();
			var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
			if (size < cwdLengthInBytes) return -68;
			stringToUTF8(cwd, buf, size);
			return cwdLengthInBytes
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_getdents64(fd, dirp, count) {
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			if (!stream.getdents) {
				stream.getdents = FS.readdir(stream.path)
			}
			var struct_size = 280;
			var pos = 0;
			var off = FS.llseek(stream, 0, 1);
			var idx = Math.floor(off / struct_size);
			while (idx < stream.getdents.length && pos + struct_size <= count) {
				var id;
				var type;
				var name = stream.getdents[idx];
				if (name === ".") {
					id = stream.node.id;
					type = 4
				} else if (name === "..") {
					var lookup = FS.lookupPath(stream.path, {
						parent: true
					});
					id = lookup.node.id;
					type = 4
				} else {
					var child = FS.lookupNode(stream.node, name);
					id = child.id;
					type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8
				}
				tempI64 = [id >>> 0, (tempDouble = id, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos >> 2] = tempI64[0], HEAP32[dirp + pos + 4 >> 2] = tempI64[1];
				tempI64 = [(idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos + 8 >> 2] = tempI64[0], HEAP32[dirp + pos + 12 >> 2] = tempI64[1];
				HEAP16[dirp + pos + 16 >> 1] = 280;
				HEAP8[dirp + pos + 18 >> 0] = type;
				stringToUTF8(name, dirp + pos + 19, 256);
				pos += struct_size;
				idx += 1
			}
			FS.llseek(stream, idx * struct_size, 0);
			return pos
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_ioctl(fd, op, varargs) {
		SYSCALLS.varargs = varargs;
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			switch (op) {
				case 21509:
				case 21505: {
					if (!stream.tty) return -59;
					return 0
				}
				case 21510:
				case 21511:
				case 21512:
				case 21506:
				case 21507:
				case 21508: {
					if (!stream.tty) return -59;
					return 0
				}
				case 21519: {
					if (!stream.tty) return -59;
					var argp = SYSCALLS.get();
					HEAP32[argp >> 2] = 0;
					return 0
				}
				case 21520: {
					if (!stream.tty) return -59;
					return -28
				}
				case 21531: {
					var argp = SYSCALLS.get();
					return FS.ioctl(stream, op, argp)
				}
				case 21523: {
					if (!stream.tty) return -59;
					return 0
				}
				case 21524: {
					if (!stream.tty) return -59;
					return 0
				}
				default:
					abort("bad ioctl syscall " + op)
			}
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_lstat64(path, buf) {
		try {
			path = SYSCALLS.getStr(path);
			return SYSCALLS.doStat(FS.lstat, path, buf)
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_mkdirat(dirfd, path, mode) {
		try {
			path = SYSCALLS.getStr(path);
			path = SYSCALLS.calculateAt(dirfd, path);
			path = PATH.normalize(path);
			if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
			FS.mkdir(path, mode, 0);
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_newfstatat(dirfd, path, buf, flags) {
		try {
			path = SYSCALLS.getStr(path);
			var nofollow = flags & 256;
			var allowEmpty = flags & 4096;
			flags = flags & ~4352;
			path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
			return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf)
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_openat(dirfd, path, flags, varargs) {
		SYSCALLS.varargs = varargs;
		try {
			path = SYSCALLS.getStr(path);
			path = SYSCALLS.calculateAt(dirfd, path);
			var mode = varargs ? SYSCALLS.get() : 0;
			return FS.open(path, flags, mode).fd
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
		try {
			path = SYSCALLS.getStr(path);
			path = SYSCALLS.calculateAt(dirfd, path);
			if (bufsize <= 0) return -28;
			var ret = FS.readlink(path);
			var len = Math.min(bufsize, lengthBytesUTF8(ret));
			var endChar = HEAP8[buf + len];
			stringToUTF8(ret, buf, bufsize + 1);
			HEAP8[buf + len] = endChar;
			return len
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
		try {
			oldpath = SYSCALLS.getStr(oldpath);
			newpath = SYSCALLS.getStr(newpath);
			oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
			newpath = SYSCALLS.calculateAt(newdirfd, newpath);
			FS.rename(oldpath, newpath);
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_rmdir(path) {
		try {
			path = SYSCALLS.getStr(path);
			FS.rmdir(path);
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_stat64(path, buf) {
		try {
			path = SYSCALLS.getStr(path);
			return SYSCALLS.doStat(FS.stat, path, buf)
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_symlink(target, linkpath) {
		try {
			target = SYSCALLS.getStr(target);
			linkpath = SYSCALLS.getStr(linkpath);
			FS.symlink(target, linkpath);
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function ___syscall_unlinkat(dirfd, path, flags) {
		try {
			path = SYSCALLS.getStr(path);
			path = SYSCALLS.calculateAt(dirfd, path);
			if (flags === 0) {
				FS.unlink(path)
			} else if (flags === 512) {
				FS.rmdir(path)
			} else {
				abort("Invalid flags passed to unlinkat")
			}
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return -e.errno
		}
	}

	function __emscripten_date_now() {
		return Date.now()
	}

	function __emscripten_fs_load_embedded_files(ptr) {
		do {
			var name_addr = HEAPU32[ptr >> 2];
			ptr += 4;
			var len = HEAPU32[ptr >> 2];
			ptr += 4;
			var content = HEAPU32[ptr >> 2];
			ptr += 4;
			var name = UTF8ToString(name_addr);
			FS.createPath("/", PATH.dirname(name), true, true);
			FS.createDataFile(name, null, HEAP8.subarray(content, content + len), true, true, true)
		} while (HEAPU32[ptr >> 2])
	}
	var nowIsMonotonic = true;

	function __emscripten_get_now_is_monotonic() {
		return nowIsMonotonic
	}

	function __emscripten_throw_longjmp() {
		throw Infinity
	}

	function _abort() {
		abort("")
	}

	function _emscripten_memcpy_big(dest, src, num) {
		HEAPU8.copyWithin(dest, src, src + num)
	}

	function getHeapMax() {
		return 2147483648
	}

	function emscripten_realloc_buffer(size) {
		try {
			wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
			updateGlobalBufferAndViews(wasmMemory.buffer);
			return 1
		} catch (e) {}
	}

	function _emscripten_resize_heap(requestedSize) {
		var oldSize = HEAPU8.length;
		requestedSize = requestedSize >>> 0;
		var maxHeapSize = getHeapMax();
		if (requestedSize > maxHeapSize) {
			return false
		}
		let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
		for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
			var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
			overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
			var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
			var replacement = emscripten_realloc_buffer(newSize);
			if (replacement) {
				return true
			}
		}
		return false
	}
	var ENV = {};

	function getExecutableName() {
		return thisProgram || "./this.program"
	}

	function getEnvStrings() {
		if (!getEnvStrings.strings) {
			var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
			var env = {
				"USER": "web_user",
				"LOGNAME": "web_user",
				"PATH": "/",
				"PWD": "/",
				"HOME": "/home/web_user",
				"LANG": lang,
				"_": getExecutableName()
			};
			for (var x in ENV) {
				if (ENV[x] === undefined) delete env[x];
				else env[x] = ENV[x]
			}
			var strings = [];
			for (var x in env) {
				strings.push(x + "=" + env[x])
			}
			getEnvStrings.strings = strings
		}
		return getEnvStrings.strings
	}

	function _environ_get(__environ, environ_buf) {
		var bufSize = 0;
		getEnvStrings().forEach(function (string, i) {
			var ptr = environ_buf + bufSize;
			HEAPU32[__environ + i * 4 >> 2] = ptr;
			writeAsciiToMemory(string, ptr);
			bufSize += string.length + 1
		});
		return 0
	}

	function _environ_sizes_get(penviron_count, penviron_buf_size) {
		var strings = getEnvStrings();
		HEAPU32[penviron_count >> 2] = strings.length;
		var bufSize = 0;
		strings.forEach(function (string) {
			bufSize += string.length + 1
		});
		HEAPU32[penviron_buf_size >> 2] = bufSize;
		return 0
	}

	function _fd_close(fd) {
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			FS.close(stream);
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return e.errno
		}
	}

	function doReadv(stream, iov, iovcnt, offset) {
		var ret = 0;
		for (var i = 0; i < iovcnt; i++) {
			var ptr = HEAPU32[iov >> 2];
			var len = HEAPU32[iov + 4 >> 2];
			iov += 8;
			var curr = FS.read(stream, HEAP8, ptr, len, offset);
			if (curr < 0) return -1;
			ret += curr;
			if (curr < len) break
		}
		return ret
	}

	function _fd_read(fd, iov, iovcnt, pnum) {
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			var num = doReadv(stream, iov, iovcnt);
			HEAP32[pnum >> 2] = num;
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return e.errno
		}
	}

	function convertI32PairToI53Checked(lo, hi) {
		return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN
	}

	function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
		try {
			var offset = convertI32PairToI53Checked(offset_low, offset_high);
			if (isNaN(offset)) return 61;
			var stream = SYSCALLS.getStreamFromFD(fd);
			FS.llseek(stream, offset, whence);
			tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
			if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return e.errno
		}
	}

	function doWritev(stream, iov, iovcnt, offset) {
		var ret = 0;
		for (var i = 0; i < iovcnt; i++) {
			var ptr = HEAPU32[iov >> 2];
			var len = HEAPU32[iov + 4 >> 2];
			iov += 8;
			var curr = FS.write(stream, HEAP8, ptr, len, offset);
			if (curr < 0) return -1;
			ret += curr
		}
		return ret
	}

	function _fd_write(fd, iov, iovcnt, pnum) {
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			var num = doWritev(stream, iov, iovcnt);
			HEAPU32[pnum >> 2] = num;
			return 0
		} catch (e) {
			if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
			return e.errno
		}
	}

	function _getTempRet0() {
		return getTempRet0()
	}

	function _setTempRet0(val) {
		setTempRet0(val)
	}
	Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas) {
		Browser.requestFullscreen(lockPointer, resizeCanvas)
	};
	Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
		Browser.requestAnimationFrame(func)
	};
	Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
		Browser.setCanvasSize(width, height, noUpdates)
	};
	Module["pauseMainLoop"] = function Module_pauseMainLoop() {
		Browser.mainLoop.pause()
	};
	Module["resumeMainLoop"] = function Module_resumeMainLoop() {
		Browser.mainLoop.resume()
	};
	Module["getUserMedia"] = function Module_getUserMedia() {
		Browser.getUserMedia()
	};
	Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
		return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes)
	};
	var preloadedImages = {};
	var preloadedAudios = {};
	var FSNode = function (parent, name, mode, rdev) {
		if (!parent) {
			parent = this
		}
		this.parent = parent;
		this.mount = parent.mount;
		this.mounted = null;
		this.id = FS.nextInode++;
		this.name = name;
		this.mode = mode;
		this.node_ops = {};
		this.stream_ops = {};
		this.rdev = rdev
	};
	var readMode = 292 | 73;
	var writeMode = 146;
	Object.defineProperties(FSNode.prototype, {
		read: {
			get: function () {
				return (this.mode & readMode) === readMode
			},
			set: function (val) {
				val ? this.mode |= readMode : this.mode &= ~readMode
			}
		},
		write: {
			get: function () {
				return (this.mode & writeMode) === writeMode
			},
			set: function (val) {
				val ? this.mode |= writeMode : this.mode &= ~writeMode
			}
		},
		isFolder: {
			get: function () {
				return FS.isDir(this.mode)
			}
		},
		isDevice: {
			get: function () {
				return FS.isChrdev(this.mode)
			}
		}
	});
	FS.FSNode = FSNode;
	FS.staticInit();
	Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
	Module["FS_createPath"] = FS.createPath;
	Module["FS_createPath"] = FS.createPath;
	Module["FS_createDataFile"] = FS.createDataFile;
	Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
	Module["FS_unlink"] = FS.unlink;
	Module["FS_createLazyFile"] = FS.createLazyFile;
	Module["FS_createDevice"] = FS.createDevice;

	function intArrayFromString(stringy, dontAddNull, length) {
		var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
		var u8array = new Array(len);
		var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
		if (dontAddNull) u8array.length = numBytesWritten;
		return u8array
	}
	var asmLibraryArg = {
		"a": ___assert_fail,
		"L": ___syscall_chmod,
		"M": ___syscall_faccessat,
		"f": ___syscall_fcntl64,
		"I": ___syscall_fstat64,
		"w": ___syscall_fstatfs64,
		"E": ___syscall_getcwd,
		"A": ___syscall_getdents64,
		"n": ___syscall_ioctl,
		"G": ___syscall_lstat64,
		"B": ___syscall_mkdirat,
		"F": ___syscall_newfstatat,
		"l": ___syscall_openat,
		"z": ___syscall_readlinkat,
		"y": ___syscall_renameat,
		"x": ___syscall_rmdir,
		"H": ___syscall_stat64,
		"v": ___syscall_symlink,
		"u": ___syscall_unlinkat,
		"i": __emscripten_date_now,
		"o": __emscripten_fs_load_embedded_files,
		"J": __emscripten_get_now_is_monotonic,
		"t": __emscripten_throw_longjmp,
		"h": _abort,
		"m": _emscripten_get_now,
		"K": _emscripten_memcpy_big,
		"g": _emscripten_resize_heap,
		"C": _environ_get,
		"D": _environ_sizes_get,
		"e": _exit,
		"d": _fd_close,
		"k": _fd_read,
		"p": _fd_seek,
		"j": _fd_write,
		"c": _getTempRet0,
		"s": invoke_iii,
		"q": invoke_iiii,
		"r": invoke_iiiii,
		"b": _setTempRet0
	};
	var asm = createWasm();
	var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function () {
		return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["O"]).apply(null, arguments)
	};
	var _main = Module["_main"] = function () {
		return (_main = Module["_main"] = Module["asm"]["P"]).apply(null, arguments)
	};
	var _emscripten_bind_VoidPtr___destroy___0 = Module["_emscripten_bind_VoidPtr___destroy___0"] = function () {
		return (_emscripten_bind_VoidPtr___destroy___0 = Module["_emscripten_bind_VoidPtr___destroy___0"] = Module["asm"]["Q"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_get_w_0 = Module["_emscripten_bind_ASS_Image_get_w_0"] = function () {
		return (_emscripten_bind_ASS_Image_get_w_0 = Module["_emscripten_bind_ASS_Image_get_w_0"] = Module["asm"]["R"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_set_w_1 = Module["_emscripten_bind_ASS_Image_set_w_1"] = function () {
		return (_emscripten_bind_ASS_Image_set_w_1 = Module["_emscripten_bind_ASS_Image_set_w_1"] = Module["asm"]["S"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_get_h_0 = Module["_emscripten_bind_ASS_Image_get_h_0"] = function () {
		return (_emscripten_bind_ASS_Image_get_h_0 = Module["_emscripten_bind_ASS_Image_get_h_0"] = Module["asm"]["T"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_set_h_1 = Module["_emscripten_bind_ASS_Image_set_h_1"] = function () {
		return (_emscripten_bind_ASS_Image_set_h_1 = Module["_emscripten_bind_ASS_Image_set_h_1"] = Module["asm"]["U"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_get_stride_0 = Module["_emscripten_bind_ASS_Image_get_stride_0"] = function () {
		return (_emscripten_bind_ASS_Image_get_stride_0 = Module["_emscripten_bind_ASS_Image_get_stride_0"] = Module["asm"]["V"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_set_stride_1 = Module["_emscripten_bind_ASS_Image_set_stride_1"] = function () {
		return (_emscripten_bind_ASS_Image_set_stride_1 = Module["_emscripten_bind_ASS_Image_set_stride_1"] = Module["asm"]["W"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_get_bitmap_0 = Module["_emscripten_bind_ASS_Image_get_bitmap_0"] = function () {
		return (_emscripten_bind_ASS_Image_get_bitmap_0 = Module["_emscripten_bind_ASS_Image_get_bitmap_0"] = Module["asm"]["X"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_set_bitmap_1 = Module["_emscripten_bind_ASS_Image_set_bitmap_1"] = function () {
		return (_emscripten_bind_ASS_Image_set_bitmap_1 = Module["_emscripten_bind_ASS_Image_set_bitmap_1"] = Module["asm"]["Y"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_get_color_0 = Module["_emscripten_bind_ASS_Image_get_color_0"] = function () {
		return (_emscripten_bind_ASS_Image_get_color_0 = Module["_emscripten_bind_ASS_Image_get_color_0"] = Module["asm"]["Z"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_set_color_1 = Module["_emscripten_bind_ASS_Image_set_color_1"] = function () {
		return (_emscripten_bind_ASS_Image_set_color_1 = Module["_emscripten_bind_ASS_Image_set_color_1"] = Module["asm"]["_"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_get_dst_x_0 = Module["_emscripten_bind_ASS_Image_get_dst_x_0"] = function () {
		return (_emscripten_bind_ASS_Image_get_dst_x_0 = Module["_emscripten_bind_ASS_Image_get_dst_x_0"] = Module["asm"]["$"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_set_dst_x_1 = Module["_emscripten_bind_ASS_Image_set_dst_x_1"] = function () {
		return (_emscripten_bind_ASS_Image_set_dst_x_1 = Module["_emscripten_bind_ASS_Image_set_dst_x_1"] = Module["asm"]["aa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_get_dst_y_0 = Module["_emscripten_bind_ASS_Image_get_dst_y_0"] = function () {
		return (_emscripten_bind_ASS_Image_get_dst_y_0 = Module["_emscripten_bind_ASS_Image_get_dst_y_0"] = Module["asm"]["ba"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_set_dst_y_1 = Module["_emscripten_bind_ASS_Image_set_dst_y_1"] = function () {
		return (_emscripten_bind_ASS_Image_set_dst_y_1 = Module["_emscripten_bind_ASS_Image_set_dst_y_1"] = Module["asm"]["ca"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_get_next_0 = Module["_emscripten_bind_ASS_Image_get_next_0"] = function () {
		return (_emscripten_bind_ASS_Image_get_next_0 = Module["_emscripten_bind_ASS_Image_get_next_0"] = Module["asm"]["da"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Image_set_next_1 = Module["_emscripten_bind_ASS_Image_set_next_1"] = function () {
		return (_emscripten_bind_ASS_Image_set_next_1 = Module["_emscripten_bind_ASS_Image_set_next_1"] = Module["asm"]["ea"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Name_0 = Module["_emscripten_bind_ASS_Style_get_Name_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Name_0 = Module["_emscripten_bind_ASS_Style_get_Name_0"] = Module["asm"]["fa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Name_1 = Module["_emscripten_bind_ASS_Style_set_Name_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Name_1 = Module["_emscripten_bind_ASS_Style_set_Name_1"] = Module["asm"]["ga"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_FontName_0 = Module["_emscripten_bind_ASS_Style_get_FontName_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_FontName_0 = Module["_emscripten_bind_ASS_Style_get_FontName_0"] = Module["asm"]["ha"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_FontName_1 = Module["_emscripten_bind_ASS_Style_set_FontName_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_FontName_1 = Module["_emscripten_bind_ASS_Style_set_FontName_1"] = Module["asm"]["ia"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_FontSize_0 = Module["_emscripten_bind_ASS_Style_get_FontSize_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_FontSize_0 = Module["_emscripten_bind_ASS_Style_get_FontSize_0"] = Module["asm"]["ja"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_FontSize_1 = Module["_emscripten_bind_ASS_Style_set_FontSize_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_FontSize_1 = Module["_emscripten_bind_ASS_Style_set_FontSize_1"] = Module["asm"]["ka"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_PrimaryColour_0 = Module["_emscripten_bind_ASS_Style_get_PrimaryColour_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_PrimaryColour_0 = Module["_emscripten_bind_ASS_Style_get_PrimaryColour_0"] = Module["asm"]["la"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_PrimaryColour_1 = Module["_emscripten_bind_ASS_Style_set_PrimaryColour_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_PrimaryColour_1 = Module["_emscripten_bind_ASS_Style_set_PrimaryColour_1"] = Module["asm"]["ma"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_SecondaryColour_0 = Module["_emscripten_bind_ASS_Style_get_SecondaryColour_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_SecondaryColour_0 = Module["_emscripten_bind_ASS_Style_get_SecondaryColour_0"] = Module["asm"]["na"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_SecondaryColour_1 = Module["_emscripten_bind_ASS_Style_set_SecondaryColour_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_SecondaryColour_1 = Module["_emscripten_bind_ASS_Style_set_SecondaryColour_1"] = Module["asm"]["oa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_OutlineColour_0 = Module["_emscripten_bind_ASS_Style_get_OutlineColour_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_OutlineColour_0 = Module["_emscripten_bind_ASS_Style_get_OutlineColour_0"] = Module["asm"]["pa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_OutlineColour_1 = Module["_emscripten_bind_ASS_Style_set_OutlineColour_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_OutlineColour_1 = Module["_emscripten_bind_ASS_Style_set_OutlineColour_1"] = Module["asm"]["qa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_BackColour_0 = Module["_emscripten_bind_ASS_Style_get_BackColour_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_BackColour_0 = Module["_emscripten_bind_ASS_Style_get_BackColour_0"] = Module["asm"]["ra"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_BackColour_1 = Module["_emscripten_bind_ASS_Style_set_BackColour_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_BackColour_1 = Module["_emscripten_bind_ASS_Style_set_BackColour_1"] = Module["asm"]["sa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Bold_0 = Module["_emscripten_bind_ASS_Style_get_Bold_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Bold_0 = Module["_emscripten_bind_ASS_Style_get_Bold_0"] = Module["asm"]["ta"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Bold_1 = Module["_emscripten_bind_ASS_Style_set_Bold_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Bold_1 = Module["_emscripten_bind_ASS_Style_set_Bold_1"] = Module["asm"]["ua"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Italic_0 = Module["_emscripten_bind_ASS_Style_get_Italic_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Italic_0 = Module["_emscripten_bind_ASS_Style_get_Italic_0"] = Module["asm"]["va"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Italic_1 = Module["_emscripten_bind_ASS_Style_set_Italic_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Italic_1 = Module["_emscripten_bind_ASS_Style_set_Italic_1"] = Module["asm"]["wa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Underline_0 = Module["_emscripten_bind_ASS_Style_get_Underline_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Underline_0 = Module["_emscripten_bind_ASS_Style_get_Underline_0"] = Module["asm"]["xa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Underline_1 = Module["_emscripten_bind_ASS_Style_set_Underline_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Underline_1 = Module["_emscripten_bind_ASS_Style_set_Underline_1"] = Module["asm"]["ya"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_StrikeOut_0 = Module["_emscripten_bind_ASS_Style_get_StrikeOut_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_StrikeOut_0 = Module["_emscripten_bind_ASS_Style_get_StrikeOut_0"] = Module["asm"]["za"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_StrikeOut_1 = Module["_emscripten_bind_ASS_Style_set_StrikeOut_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_StrikeOut_1 = Module["_emscripten_bind_ASS_Style_set_StrikeOut_1"] = Module["asm"]["Aa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_ScaleX_0 = Module["_emscripten_bind_ASS_Style_get_ScaleX_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_ScaleX_0 = Module["_emscripten_bind_ASS_Style_get_ScaleX_0"] = Module["asm"]["Ba"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_ScaleX_1 = Module["_emscripten_bind_ASS_Style_set_ScaleX_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_ScaleX_1 = Module["_emscripten_bind_ASS_Style_set_ScaleX_1"] = Module["asm"]["Ca"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_ScaleY_0 = Module["_emscripten_bind_ASS_Style_get_ScaleY_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_ScaleY_0 = Module["_emscripten_bind_ASS_Style_get_ScaleY_0"] = Module["asm"]["Da"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_ScaleY_1 = Module["_emscripten_bind_ASS_Style_set_ScaleY_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_ScaleY_1 = Module["_emscripten_bind_ASS_Style_set_ScaleY_1"] = Module["asm"]["Ea"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Spacing_0 = Module["_emscripten_bind_ASS_Style_get_Spacing_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Spacing_0 = Module["_emscripten_bind_ASS_Style_get_Spacing_0"] = Module["asm"]["Fa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Spacing_1 = Module["_emscripten_bind_ASS_Style_set_Spacing_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Spacing_1 = Module["_emscripten_bind_ASS_Style_set_Spacing_1"] = Module["asm"]["Ga"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Angle_0 = Module["_emscripten_bind_ASS_Style_get_Angle_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Angle_0 = Module["_emscripten_bind_ASS_Style_get_Angle_0"] = Module["asm"]["Ha"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Angle_1 = Module["_emscripten_bind_ASS_Style_set_Angle_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Angle_1 = Module["_emscripten_bind_ASS_Style_set_Angle_1"] = Module["asm"]["Ia"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_BorderStyle_0 = Module["_emscripten_bind_ASS_Style_get_BorderStyle_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_BorderStyle_0 = Module["_emscripten_bind_ASS_Style_get_BorderStyle_0"] = Module["asm"]["Ja"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_BorderStyle_1 = Module["_emscripten_bind_ASS_Style_set_BorderStyle_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_BorderStyle_1 = Module["_emscripten_bind_ASS_Style_set_BorderStyle_1"] = Module["asm"]["Ka"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Outline_0 = Module["_emscripten_bind_ASS_Style_get_Outline_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Outline_0 = Module["_emscripten_bind_ASS_Style_get_Outline_0"] = Module["asm"]["La"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Outline_1 = Module["_emscripten_bind_ASS_Style_set_Outline_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Outline_1 = Module["_emscripten_bind_ASS_Style_set_Outline_1"] = Module["asm"]["Ma"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Shadow_0 = Module["_emscripten_bind_ASS_Style_get_Shadow_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Shadow_0 = Module["_emscripten_bind_ASS_Style_get_Shadow_0"] = Module["asm"]["Na"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Shadow_1 = Module["_emscripten_bind_ASS_Style_set_Shadow_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Shadow_1 = Module["_emscripten_bind_ASS_Style_set_Shadow_1"] = Module["asm"]["Oa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Alignment_0 = Module["_emscripten_bind_ASS_Style_get_Alignment_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Alignment_0 = Module["_emscripten_bind_ASS_Style_get_Alignment_0"] = Module["asm"]["Pa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Alignment_1 = Module["_emscripten_bind_ASS_Style_set_Alignment_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Alignment_1 = Module["_emscripten_bind_ASS_Style_set_Alignment_1"] = Module["asm"]["Qa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_MarginL_0 = Module["_emscripten_bind_ASS_Style_get_MarginL_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_MarginL_0 = Module["_emscripten_bind_ASS_Style_get_MarginL_0"] = Module["asm"]["Ra"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_MarginL_1 = Module["_emscripten_bind_ASS_Style_set_MarginL_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_MarginL_1 = Module["_emscripten_bind_ASS_Style_set_MarginL_1"] = Module["asm"]["Sa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_MarginR_0 = Module["_emscripten_bind_ASS_Style_get_MarginR_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_MarginR_0 = Module["_emscripten_bind_ASS_Style_get_MarginR_0"] = Module["asm"]["Ta"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_MarginR_1 = Module["_emscripten_bind_ASS_Style_set_MarginR_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_MarginR_1 = Module["_emscripten_bind_ASS_Style_set_MarginR_1"] = Module["asm"]["Ua"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_MarginV_0 = Module["_emscripten_bind_ASS_Style_get_MarginV_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_MarginV_0 = Module["_emscripten_bind_ASS_Style_get_MarginV_0"] = Module["asm"]["Va"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_MarginV_1 = Module["_emscripten_bind_ASS_Style_set_MarginV_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_MarginV_1 = Module["_emscripten_bind_ASS_Style_set_MarginV_1"] = Module["asm"]["Wa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Encoding_0 = Module["_emscripten_bind_ASS_Style_get_Encoding_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Encoding_0 = Module["_emscripten_bind_ASS_Style_get_Encoding_0"] = Module["asm"]["Xa"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Encoding_1 = Module["_emscripten_bind_ASS_Style_set_Encoding_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Encoding_1 = Module["_emscripten_bind_ASS_Style_set_Encoding_1"] = Module["asm"]["Ya"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_treat_fontname_as_pattern_0 = Module["_emscripten_bind_ASS_Style_get_treat_fontname_as_pattern_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_treat_fontname_as_pattern_0 = Module["_emscripten_bind_ASS_Style_get_treat_fontname_as_pattern_0"] = Module["asm"]["Za"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_treat_fontname_as_pattern_1 = Module["_emscripten_bind_ASS_Style_set_treat_fontname_as_pattern_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_treat_fontname_as_pattern_1 = Module["_emscripten_bind_ASS_Style_set_treat_fontname_as_pattern_1"] = Module["asm"]["_a"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Blur_0 = Module["_emscripten_bind_ASS_Style_get_Blur_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Blur_0 = Module["_emscripten_bind_ASS_Style_get_Blur_0"] = Module["asm"]["$a"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Blur_1 = Module["_emscripten_bind_ASS_Style_set_Blur_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Blur_1 = Module["_emscripten_bind_ASS_Style_set_Blur_1"] = Module["asm"]["ab"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_get_Justify_0 = Module["_emscripten_bind_ASS_Style_get_Justify_0"] = function () {
		return (_emscripten_bind_ASS_Style_get_Justify_0 = Module["_emscripten_bind_ASS_Style_get_Justify_0"] = Module["asm"]["bb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Style_set_Justify_1 = Module["_emscripten_bind_ASS_Style_set_Justify_1"] = function () {
		return (_emscripten_bind_ASS_Style_set_Justify_1 = Module["_emscripten_bind_ASS_Style_set_Justify_1"] = Module["asm"]["cb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_Start_0 = Module["_emscripten_bind_ASS_Event_get_Start_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_Start_0 = Module["_emscripten_bind_ASS_Event_get_Start_0"] = Module["asm"]["db"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_Start_1 = Module["_emscripten_bind_ASS_Event_set_Start_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_Start_1 = Module["_emscripten_bind_ASS_Event_set_Start_1"] = Module["asm"]["eb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_Duration_0 = Module["_emscripten_bind_ASS_Event_get_Duration_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_Duration_0 = Module["_emscripten_bind_ASS_Event_get_Duration_0"] = Module["asm"]["fb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_Duration_1 = Module["_emscripten_bind_ASS_Event_set_Duration_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_Duration_1 = Module["_emscripten_bind_ASS_Event_set_Duration_1"] = Module["asm"]["gb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_ReadOrder_0 = Module["_emscripten_bind_ASS_Event_get_ReadOrder_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_ReadOrder_0 = Module["_emscripten_bind_ASS_Event_get_ReadOrder_0"] = Module["asm"]["hb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_ReadOrder_1 = Module["_emscripten_bind_ASS_Event_set_ReadOrder_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_ReadOrder_1 = Module["_emscripten_bind_ASS_Event_set_ReadOrder_1"] = Module["asm"]["ib"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_Layer_0 = Module["_emscripten_bind_ASS_Event_get_Layer_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_Layer_0 = Module["_emscripten_bind_ASS_Event_get_Layer_0"] = Module["asm"]["jb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_Layer_1 = Module["_emscripten_bind_ASS_Event_set_Layer_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_Layer_1 = Module["_emscripten_bind_ASS_Event_set_Layer_1"] = Module["asm"]["kb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_Style_0 = Module["_emscripten_bind_ASS_Event_get_Style_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_Style_0 = Module["_emscripten_bind_ASS_Event_get_Style_0"] = Module["asm"]["lb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_Style_1 = Module["_emscripten_bind_ASS_Event_set_Style_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_Style_1 = Module["_emscripten_bind_ASS_Event_set_Style_1"] = Module["asm"]["mb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_Name_0 = Module["_emscripten_bind_ASS_Event_get_Name_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_Name_0 = Module["_emscripten_bind_ASS_Event_get_Name_0"] = Module["asm"]["nb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_Name_1 = Module["_emscripten_bind_ASS_Event_set_Name_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_Name_1 = Module["_emscripten_bind_ASS_Event_set_Name_1"] = Module["asm"]["ob"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_MarginL_0 = Module["_emscripten_bind_ASS_Event_get_MarginL_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_MarginL_0 = Module["_emscripten_bind_ASS_Event_get_MarginL_0"] = Module["asm"]["pb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_MarginL_1 = Module["_emscripten_bind_ASS_Event_set_MarginL_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_MarginL_1 = Module["_emscripten_bind_ASS_Event_set_MarginL_1"] = Module["asm"]["qb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_MarginR_0 = Module["_emscripten_bind_ASS_Event_get_MarginR_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_MarginR_0 = Module["_emscripten_bind_ASS_Event_get_MarginR_0"] = Module["asm"]["rb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_MarginR_1 = Module["_emscripten_bind_ASS_Event_set_MarginR_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_MarginR_1 = Module["_emscripten_bind_ASS_Event_set_MarginR_1"] = Module["asm"]["sb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_MarginV_0 = Module["_emscripten_bind_ASS_Event_get_MarginV_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_MarginV_0 = Module["_emscripten_bind_ASS_Event_get_MarginV_0"] = Module["asm"]["tb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_MarginV_1 = Module["_emscripten_bind_ASS_Event_set_MarginV_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_MarginV_1 = Module["_emscripten_bind_ASS_Event_set_MarginV_1"] = Module["asm"]["ub"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_Effect_0 = Module["_emscripten_bind_ASS_Event_get_Effect_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_Effect_0 = Module["_emscripten_bind_ASS_Event_get_Effect_0"] = Module["asm"]["vb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_Effect_1 = Module["_emscripten_bind_ASS_Event_set_Effect_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_Effect_1 = Module["_emscripten_bind_ASS_Event_set_Effect_1"] = Module["asm"]["wb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_get_Text_0 = Module["_emscripten_bind_ASS_Event_get_Text_0"] = function () {
		return (_emscripten_bind_ASS_Event_get_Text_0 = Module["_emscripten_bind_ASS_Event_get_Text_0"] = Module["asm"]["xb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Event_set_Text_1 = Module["_emscripten_bind_ASS_Event_set_Text_1"] = function () {
		return (_emscripten_bind_ASS_Event_set_Text_1 = Module["_emscripten_bind_ASS_Event_set_Text_1"] = Module["asm"]["yb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_n_styles_0 = Module["_emscripten_bind_ASS_Track_get_n_styles_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_n_styles_0 = Module["_emscripten_bind_ASS_Track_get_n_styles_0"] = Module["asm"]["zb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_n_styles_1 = Module["_emscripten_bind_ASS_Track_set_n_styles_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_n_styles_1 = Module["_emscripten_bind_ASS_Track_set_n_styles_1"] = Module["asm"]["Ab"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_max_styles_0 = Module["_emscripten_bind_ASS_Track_get_max_styles_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_max_styles_0 = Module["_emscripten_bind_ASS_Track_get_max_styles_0"] = Module["asm"]["Bb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_max_styles_1 = Module["_emscripten_bind_ASS_Track_set_max_styles_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_max_styles_1 = Module["_emscripten_bind_ASS_Track_set_max_styles_1"] = Module["asm"]["Cb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_n_events_0 = Module["_emscripten_bind_ASS_Track_get_n_events_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_n_events_0 = Module["_emscripten_bind_ASS_Track_get_n_events_0"] = Module["asm"]["Db"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_n_events_1 = Module["_emscripten_bind_ASS_Track_set_n_events_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_n_events_1 = Module["_emscripten_bind_ASS_Track_set_n_events_1"] = Module["asm"]["Eb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_max_events_0 = Module["_emscripten_bind_ASS_Track_get_max_events_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_max_events_0 = Module["_emscripten_bind_ASS_Track_get_max_events_0"] = Module["asm"]["Fb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_max_events_1 = Module["_emscripten_bind_ASS_Track_set_max_events_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_max_events_1 = Module["_emscripten_bind_ASS_Track_set_max_events_1"] = Module["asm"]["Gb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_styles_1 = Module["_emscripten_bind_ASS_Track_get_styles_1"] = function () {
		return (_emscripten_bind_ASS_Track_get_styles_1 = Module["_emscripten_bind_ASS_Track_get_styles_1"] = Module["asm"]["Hb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_styles_2 = Module["_emscripten_bind_ASS_Track_set_styles_2"] = function () {
		return (_emscripten_bind_ASS_Track_set_styles_2 = Module["_emscripten_bind_ASS_Track_set_styles_2"] = Module["asm"]["Ib"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_events_1 = Module["_emscripten_bind_ASS_Track_get_events_1"] = function () {
		return (_emscripten_bind_ASS_Track_get_events_1 = Module["_emscripten_bind_ASS_Track_get_events_1"] = Module["asm"]["Jb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_events_2 = Module["_emscripten_bind_ASS_Track_set_events_2"] = function () {
		return (_emscripten_bind_ASS_Track_set_events_2 = Module["_emscripten_bind_ASS_Track_set_events_2"] = Module["asm"]["Kb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_style_format_0 = Module["_emscripten_bind_ASS_Track_get_style_format_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_style_format_0 = Module["_emscripten_bind_ASS_Track_get_style_format_0"] = Module["asm"]["Lb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_style_format_1 = Module["_emscripten_bind_ASS_Track_set_style_format_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_style_format_1 = Module["_emscripten_bind_ASS_Track_set_style_format_1"] = Module["asm"]["Mb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_event_format_0 = Module["_emscripten_bind_ASS_Track_get_event_format_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_event_format_0 = Module["_emscripten_bind_ASS_Track_get_event_format_0"] = Module["asm"]["Nb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_event_format_1 = Module["_emscripten_bind_ASS_Track_set_event_format_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_event_format_1 = Module["_emscripten_bind_ASS_Track_set_event_format_1"] = Module["asm"]["Ob"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_PlayResX_0 = Module["_emscripten_bind_ASS_Track_get_PlayResX_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_PlayResX_0 = Module["_emscripten_bind_ASS_Track_get_PlayResX_0"] = Module["asm"]["Pb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_PlayResX_1 = Module["_emscripten_bind_ASS_Track_set_PlayResX_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_PlayResX_1 = Module["_emscripten_bind_ASS_Track_set_PlayResX_1"] = Module["asm"]["Qb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_PlayResY_0 = Module["_emscripten_bind_ASS_Track_get_PlayResY_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_PlayResY_0 = Module["_emscripten_bind_ASS_Track_get_PlayResY_0"] = Module["asm"]["Rb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_PlayResY_1 = Module["_emscripten_bind_ASS_Track_set_PlayResY_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_PlayResY_1 = Module["_emscripten_bind_ASS_Track_set_PlayResY_1"] = Module["asm"]["Sb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_Timer_0 = Module["_emscripten_bind_ASS_Track_get_Timer_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_Timer_0 = Module["_emscripten_bind_ASS_Track_get_Timer_0"] = Module["asm"]["Tb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_Timer_1 = Module["_emscripten_bind_ASS_Track_set_Timer_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_Timer_1 = Module["_emscripten_bind_ASS_Track_set_Timer_1"] = Module["asm"]["Ub"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_WrapStyle_0 = Module["_emscripten_bind_ASS_Track_get_WrapStyle_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_WrapStyle_0 = Module["_emscripten_bind_ASS_Track_get_WrapStyle_0"] = Module["asm"]["Vb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_WrapStyle_1 = Module["_emscripten_bind_ASS_Track_set_WrapStyle_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_WrapStyle_1 = Module["_emscripten_bind_ASS_Track_set_WrapStyle_1"] = Module["asm"]["Wb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_ScaledBorderAndShadow_0 = Module["_emscripten_bind_ASS_Track_get_ScaledBorderAndShadow_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_ScaledBorderAndShadow_0 = Module["_emscripten_bind_ASS_Track_get_ScaledBorderAndShadow_0"] = Module["asm"]["Xb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_ScaledBorderAndShadow_1 = Module["_emscripten_bind_ASS_Track_set_ScaledBorderAndShadow_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_ScaledBorderAndShadow_1 = Module["_emscripten_bind_ASS_Track_set_ScaledBorderAndShadow_1"] = Module["asm"]["Yb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_Kerning_0 = Module["_emscripten_bind_ASS_Track_get_Kerning_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_Kerning_0 = Module["_emscripten_bind_ASS_Track_get_Kerning_0"] = Module["asm"]["Zb"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_Kerning_1 = Module["_emscripten_bind_ASS_Track_set_Kerning_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_Kerning_1 = Module["_emscripten_bind_ASS_Track_set_Kerning_1"] = Module["asm"]["_b"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_Language_0 = Module["_emscripten_bind_ASS_Track_get_Language_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_Language_0 = Module["_emscripten_bind_ASS_Track_get_Language_0"] = Module["asm"]["$b"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_Language_1 = Module["_emscripten_bind_ASS_Track_set_Language_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_Language_1 = Module["_emscripten_bind_ASS_Track_set_Language_1"] = Module["asm"]["ac"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_default_style_0 = Module["_emscripten_bind_ASS_Track_get_default_style_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_default_style_0 = Module["_emscripten_bind_ASS_Track_get_default_style_0"] = Module["asm"]["bc"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_default_style_1 = Module["_emscripten_bind_ASS_Track_set_default_style_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_default_style_1 = Module["_emscripten_bind_ASS_Track_set_default_style_1"] = Module["asm"]["cc"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_get_name_0 = Module["_emscripten_bind_ASS_Track_get_name_0"] = function () {
		return (_emscripten_bind_ASS_Track_get_name_0 = Module["_emscripten_bind_ASS_Track_get_name_0"] = Module["asm"]["dc"]).apply(null, arguments)
	};
	var _emscripten_bind_ASS_Track_set_name_1 = Module["_emscripten_bind_ASS_Track_set_name_1"] = function () {
		return (_emscripten_bind_ASS_Track_set_name_1 = Module["_emscripten_bind_ASS_Track_set_name_1"] = Module["asm"]["ec"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_libass_0 = Module["_emscripten_bind_libass_libass_0"] = function () {
		return (_emscripten_bind_libass_libass_0 = Module["_emscripten_bind_libass_libass_0"] = Module["asm"]["fc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_library_version_0 = Module["_emscripten_bind_libass_oct_library_version_0"] = function () {
		return (_emscripten_bind_libass_oct_library_version_0 = Module["_emscripten_bind_libass_oct_library_version_0"] = Module["asm"]["gc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_library_init_0 = Module["_emscripten_bind_libass_oct_library_init_0"] = function () {
		return (_emscripten_bind_libass_oct_library_init_0 = Module["_emscripten_bind_libass_oct_library_init_0"] = Module["asm"]["hc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_library_done_1 = Module["_emscripten_bind_libass_oct_library_done_1"] = function () {
		return (_emscripten_bind_libass_oct_library_done_1 = Module["_emscripten_bind_libass_oct_library_done_1"] = Module["asm"]["ic"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_fonts_dir_2 = Module["_emscripten_bind_libass_oct_set_fonts_dir_2"] = function () {
		return (_emscripten_bind_libass_oct_set_fonts_dir_2 = Module["_emscripten_bind_libass_oct_set_fonts_dir_2"] = Module["asm"]["jc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_extract_fonts_2 = Module["_emscripten_bind_libass_oct_set_extract_fonts_2"] = function () {
		return (_emscripten_bind_libass_oct_set_extract_fonts_2 = Module["_emscripten_bind_libass_oct_set_extract_fonts_2"] = Module["asm"]["kc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_style_overrides_2 = Module["_emscripten_bind_libass_oct_set_style_overrides_2"] = function () {
		return (_emscripten_bind_libass_oct_set_style_overrides_2 = Module["_emscripten_bind_libass_oct_set_style_overrides_2"] = Module["asm"]["lc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_process_force_style_1 = Module["_emscripten_bind_libass_oct_process_force_style_1"] = function () {
		return (_emscripten_bind_libass_oct_process_force_style_1 = Module["_emscripten_bind_libass_oct_process_force_style_1"] = Module["asm"]["mc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_renderer_init_1 = Module["_emscripten_bind_libass_oct_renderer_init_1"] = function () {
		return (_emscripten_bind_libass_oct_renderer_init_1 = Module["_emscripten_bind_libass_oct_renderer_init_1"] = Module["asm"]["nc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_renderer_done_1 = Module["_emscripten_bind_libass_oct_renderer_done_1"] = function () {
		return (_emscripten_bind_libass_oct_renderer_done_1 = Module["_emscripten_bind_libass_oct_renderer_done_1"] = Module["asm"]["oc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_frame_size_3 = Module["_emscripten_bind_libass_oct_set_frame_size_3"] = function () {
		return (_emscripten_bind_libass_oct_set_frame_size_3 = Module["_emscripten_bind_libass_oct_set_frame_size_3"] = Module["asm"]["pc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_storage_size_3 = Module["_emscripten_bind_libass_oct_set_storage_size_3"] = function () {
		return (_emscripten_bind_libass_oct_set_storage_size_3 = Module["_emscripten_bind_libass_oct_set_storage_size_3"] = Module["asm"]["qc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_shaper_2 = Module["_emscripten_bind_libass_oct_set_shaper_2"] = function () {
		return (_emscripten_bind_libass_oct_set_shaper_2 = Module["_emscripten_bind_libass_oct_set_shaper_2"] = Module["asm"]["rc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_margins_5 = Module["_emscripten_bind_libass_oct_set_margins_5"] = function () {
		return (_emscripten_bind_libass_oct_set_margins_5 = Module["_emscripten_bind_libass_oct_set_margins_5"] = Module["asm"]["sc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_use_margins_2 = Module["_emscripten_bind_libass_oct_set_use_margins_2"] = function () {
		return (_emscripten_bind_libass_oct_set_use_margins_2 = Module["_emscripten_bind_libass_oct_set_use_margins_2"] = Module["asm"]["tc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_pixel_aspect_2 = Module["_emscripten_bind_libass_oct_set_pixel_aspect_2"] = function () {
		return (_emscripten_bind_libass_oct_set_pixel_aspect_2 = Module["_emscripten_bind_libass_oct_set_pixel_aspect_2"] = Module["asm"]["uc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_aspect_ratio_3 = Module["_emscripten_bind_libass_oct_set_aspect_ratio_3"] = function () {
		return (_emscripten_bind_libass_oct_set_aspect_ratio_3 = Module["_emscripten_bind_libass_oct_set_aspect_ratio_3"] = Module["asm"]["vc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_font_scale_2 = Module["_emscripten_bind_libass_oct_set_font_scale_2"] = function () {
		return (_emscripten_bind_libass_oct_set_font_scale_2 = Module["_emscripten_bind_libass_oct_set_font_scale_2"] = Module["asm"]["wc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_hinting_2 = Module["_emscripten_bind_libass_oct_set_hinting_2"] = function () {
		return (_emscripten_bind_libass_oct_set_hinting_2 = Module["_emscripten_bind_libass_oct_set_hinting_2"] = Module["asm"]["xc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_line_spacing_2 = Module["_emscripten_bind_libass_oct_set_line_spacing_2"] = function () {
		return (_emscripten_bind_libass_oct_set_line_spacing_2 = Module["_emscripten_bind_libass_oct_set_line_spacing_2"] = Module["asm"]["yc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_line_position_2 = Module["_emscripten_bind_libass_oct_set_line_position_2"] = function () {
		return (_emscripten_bind_libass_oct_set_line_position_2 = Module["_emscripten_bind_libass_oct_set_line_position_2"] = Module["asm"]["zc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_fonts_6 = Module["_emscripten_bind_libass_oct_set_fonts_6"] = function () {
		return (_emscripten_bind_libass_oct_set_fonts_6 = Module["_emscripten_bind_libass_oct_set_fonts_6"] = Module["asm"]["Ac"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_selective_style_override_enabled_2 = Module["_emscripten_bind_libass_oct_set_selective_style_override_enabled_2"] = function () {
		return (_emscripten_bind_libass_oct_set_selective_style_override_enabled_2 = Module["_emscripten_bind_libass_oct_set_selective_style_override_enabled_2"] = Module["asm"]["Bc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_selective_style_override_2 = Module["_emscripten_bind_libass_oct_set_selective_style_override_2"] = function () {
		return (_emscripten_bind_libass_oct_set_selective_style_override_2 = Module["_emscripten_bind_libass_oct_set_selective_style_override_2"] = Module["asm"]["Cc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_set_cache_limits_3 = Module["_emscripten_bind_libass_oct_set_cache_limits_3"] = function () {
		return (_emscripten_bind_libass_oct_set_cache_limits_3 = Module["_emscripten_bind_libass_oct_set_cache_limits_3"] = Module["asm"]["Dc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_render_frame_4 = Module["_emscripten_bind_libass_oct_render_frame_4"] = function () {
		return (_emscripten_bind_libass_oct_render_frame_4 = Module["_emscripten_bind_libass_oct_render_frame_4"] = Module["asm"]["Ec"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_new_track_1 = Module["_emscripten_bind_libass_oct_new_track_1"] = function () {
		return (_emscripten_bind_libass_oct_new_track_1 = Module["_emscripten_bind_libass_oct_new_track_1"] = Module["asm"]["Fc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_free_track_1 = Module["_emscripten_bind_libass_oct_free_track_1"] = function () {
		return (_emscripten_bind_libass_oct_free_track_1 = Module["_emscripten_bind_libass_oct_free_track_1"] = Module["asm"]["Gc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_alloc_style_1 = Module["_emscripten_bind_libass_oct_alloc_style_1"] = function () {
		return (_emscripten_bind_libass_oct_alloc_style_1 = Module["_emscripten_bind_libass_oct_alloc_style_1"] = Module["asm"]["Hc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_alloc_event_1 = Module["_emscripten_bind_libass_oct_alloc_event_1"] = function () {
		return (_emscripten_bind_libass_oct_alloc_event_1 = Module["_emscripten_bind_libass_oct_alloc_event_1"] = Module["asm"]["Ic"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_free_style_2 = Module["_emscripten_bind_libass_oct_free_style_2"] = function () {
		return (_emscripten_bind_libass_oct_free_style_2 = Module["_emscripten_bind_libass_oct_free_style_2"] = Module["asm"]["Jc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_free_event_2 = Module["_emscripten_bind_libass_oct_free_event_2"] = function () {
		return (_emscripten_bind_libass_oct_free_event_2 = Module["_emscripten_bind_libass_oct_free_event_2"] = Module["asm"]["Kc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_flush_events_1 = Module["_emscripten_bind_libass_oct_flush_events_1"] = function () {
		return (_emscripten_bind_libass_oct_flush_events_1 = Module["_emscripten_bind_libass_oct_flush_events_1"] = Module["asm"]["Lc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_read_file_3 = Module["_emscripten_bind_libass_oct_read_file_3"] = function () {
		return (_emscripten_bind_libass_oct_read_file_3 = Module["_emscripten_bind_libass_oct_read_file_3"] = Module["asm"]["Mc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_add_font_4 = Module["_emscripten_bind_libass_oct_add_font_4"] = function () {
		return (_emscripten_bind_libass_oct_add_font_4 = Module["_emscripten_bind_libass_oct_add_font_4"] = Module["asm"]["Nc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_clear_fonts_1 = Module["_emscripten_bind_libass_oct_clear_fonts_1"] = function () {
		return (_emscripten_bind_libass_oct_clear_fonts_1 = Module["_emscripten_bind_libass_oct_clear_fonts_1"] = Module["asm"]["Oc"]).apply(null, arguments)
	};
	var _emscripten_bind_libass_oct_step_sub_3 = Module["_emscripten_bind_libass_oct_step_sub_3"] = function () {
		return (_emscripten_bind_libass_oct_step_sub_3 = Module["_emscripten_bind_libass_oct_step_sub_3"] = Module["asm"]["Pc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_get_changed_0 = Module["_emscripten_bind_RenderBlendResult_get_changed_0"] = function () {
		return (_emscripten_bind_RenderBlendResult_get_changed_0 = Module["_emscripten_bind_RenderBlendResult_get_changed_0"] = Module["asm"]["Qc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_set_changed_1 = Module["_emscripten_bind_RenderBlendResult_set_changed_1"] = function () {
		return (_emscripten_bind_RenderBlendResult_set_changed_1 = Module["_emscripten_bind_RenderBlendResult_set_changed_1"] = Module["asm"]["Rc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_get_blend_time_0 = Module["_emscripten_bind_RenderBlendResult_get_blend_time_0"] = function () {
		return (_emscripten_bind_RenderBlendResult_get_blend_time_0 = Module["_emscripten_bind_RenderBlendResult_get_blend_time_0"] = Module["asm"]["Sc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_set_blend_time_1 = Module["_emscripten_bind_RenderBlendResult_set_blend_time_1"] = function () {
		return (_emscripten_bind_RenderBlendResult_set_blend_time_1 = Module["_emscripten_bind_RenderBlendResult_set_blend_time_1"] = Module["asm"]["Tc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_get_dest_x_0 = Module["_emscripten_bind_RenderBlendResult_get_dest_x_0"] = function () {
		return (_emscripten_bind_RenderBlendResult_get_dest_x_0 = Module["_emscripten_bind_RenderBlendResult_get_dest_x_0"] = Module["asm"]["Uc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_set_dest_x_1 = Module["_emscripten_bind_RenderBlendResult_set_dest_x_1"] = function () {
		return (_emscripten_bind_RenderBlendResult_set_dest_x_1 = Module["_emscripten_bind_RenderBlendResult_set_dest_x_1"] = Module["asm"]["Vc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_get_dest_y_0 = Module["_emscripten_bind_RenderBlendResult_get_dest_y_0"] = function () {
		return (_emscripten_bind_RenderBlendResult_get_dest_y_0 = Module["_emscripten_bind_RenderBlendResult_get_dest_y_0"] = Module["asm"]["Wc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_set_dest_y_1 = Module["_emscripten_bind_RenderBlendResult_set_dest_y_1"] = function () {
		return (_emscripten_bind_RenderBlendResult_set_dest_y_1 = Module["_emscripten_bind_RenderBlendResult_set_dest_y_1"] = Module["asm"]["Xc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_get_dest_width_0 = Module["_emscripten_bind_RenderBlendResult_get_dest_width_0"] = function () {
		return (_emscripten_bind_RenderBlendResult_get_dest_width_0 = Module["_emscripten_bind_RenderBlendResult_get_dest_width_0"] = Module["asm"]["Yc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_set_dest_width_1 = Module["_emscripten_bind_RenderBlendResult_set_dest_width_1"] = function () {
		return (_emscripten_bind_RenderBlendResult_set_dest_width_1 = Module["_emscripten_bind_RenderBlendResult_set_dest_width_1"] = Module["asm"]["Zc"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_get_dest_height_0 = Module["_emscripten_bind_RenderBlendResult_get_dest_height_0"] = function () {
		return (_emscripten_bind_RenderBlendResult_get_dest_height_0 = Module["_emscripten_bind_RenderBlendResult_get_dest_height_0"] = Module["asm"]["_c"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_set_dest_height_1 = Module["_emscripten_bind_RenderBlendResult_set_dest_height_1"] = function () {
		return (_emscripten_bind_RenderBlendResult_set_dest_height_1 = Module["_emscripten_bind_RenderBlendResult_set_dest_height_1"] = Module["asm"]["$c"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_get_image_0 = Module["_emscripten_bind_RenderBlendResult_get_image_0"] = function () {
		return (_emscripten_bind_RenderBlendResult_get_image_0 = Module["_emscripten_bind_RenderBlendResult_get_image_0"] = Module["asm"]["ad"]).apply(null, arguments)
	};
	var _emscripten_bind_RenderBlendResult_set_image_1 = Module["_emscripten_bind_RenderBlendResult_set_image_1"] = function () {
		return (_emscripten_bind_RenderBlendResult_set_image_1 = Module["_emscripten_bind_RenderBlendResult_set_image_1"] = Module["asm"]["bd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_SubtitleOctopus_0 = Module["_emscripten_bind_SubtitleOctopus_SubtitleOctopus_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_SubtitleOctopus_0 = Module["_emscripten_bind_SubtitleOctopus_SubtitleOctopus_0"] = Module["asm"]["cd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_setLogLevel_1 = Module["_emscripten_bind_SubtitleOctopus_setLogLevel_1"] = function () {
		return (_emscripten_bind_SubtitleOctopus_setLogLevel_1 = Module["_emscripten_bind_SubtitleOctopus_setLogLevel_1"] = Module["asm"]["dd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_setDropAnimations_1 = Module["_emscripten_bind_SubtitleOctopus_setDropAnimations_1"] = function () {
		return (_emscripten_bind_SubtitleOctopus_setDropAnimations_1 = Module["_emscripten_bind_SubtitleOctopus_setDropAnimations_1"] = Module["asm"]["ed"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_initLibrary_3 = Module["_emscripten_bind_SubtitleOctopus_initLibrary_3"] = function () {
		return (_emscripten_bind_SubtitleOctopus_initLibrary_3 = Module["_emscripten_bind_SubtitleOctopus_initLibrary_3"] = Module["asm"]["fd"]).apply(null, arguments)
	};
	var _free = Module["_free"] = function () {
		return (_free = Module["_free"] = Module["asm"]["gd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_createTrack_1 = Module["_emscripten_bind_SubtitleOctopus_createTrack_1"] = function () {
		return (_emscripten_bind_SubtitleOctopus_createTrack_1 = Module["_emscripten_bind_SubtitleOctopus_createTrack_1"] = Module["asm"]["hd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_createTrackMem_2 = Module["_emscripten_bind_SubtitleOctopus_createTrackMem_2"] = function () {
		return (_emscripten_bind_SubtitleOctopus_createTrackMem_2 = Module["_emscripten_bind_SubtitleOctopus_createTrackMem_2"] = Module["asm"]["id"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_removeTrack_0 = Module["_emscripten_bind_SubtitleOctopus_removeTrack_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_removeTrack_0 = Module["_emscripten_bind_SubtitleOctopus_removeTrack_0"] = Module["asm"]["jd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_resizeCanvas_2 = Module["_emscripten_bind_SubtitleOctopus_resizeCanvas_2"] = function () {
		return (_emscripten_bind_SubtitleOctopus_resizeCanvas_2 = Module["_emscripten_bind_SubtitleOctopus_resizeCanvas_2"] = Module["asm"]["kd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_renderImage_2 = Module["_emscripten_bind_SubtitleOctopus_renderImage_2"] = function () {
		return (_emscripten_bind_SubtitleOctopus_renderImage_2 = Module["_emscripten_bind_SubtitleOctopus_renderImage_2"] = Module["asm"]["ld"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_quitLibrary_0 = Module["_emscripten_bind_SubtitleOctopus_quitLibrary_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_quitLibrary_0 = Module["_emscripten_bind_SubtitleOctopus_quitLibrary_0"] = Module["asm"]["md"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_reloadLibrary_0 = Module["_emscripten_bind_SubtitleOctopus_reloadLibrary_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_reloadLibrary_0 = Module["_emscripten_bind_SubtitleOctopus_reloadLibrary_0"] = Module["asm"]["nd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_reloadFonts_0 = Module["_emscripten_bind_SubtitleOctopus_reloadFonts_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_reloadFonts_0 = Module["_emscripten_bind_SubtitleOctopus_reloadFonts_0"] = Module["asm"]["od"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_setMargin_4 = Module["_emscripten_bind_SubtitleOctopus_setMargin_4"] = function () {
		return (_emscripten_bind_SubtitleOctopus_setMargin_4 = Module["_emscripten_bind_SubtitleOctopus_setMargin_4"] = Module["asm"]["pd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_getEventCount_0 = Module["_emscripten_bind_SubtitleOctopus_getEventCount_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_getEventCount_0 = Module["_emscripten_bind_SubtitleOctopus_getEventCount_0"] = Module["asm"]["qd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_allocEvent_0 = Module["_emscripten_bind_SubtitleOctopus_allocEvent_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_allocEvent_0 = Module["_emscripten_bind_SubtitleOctopus_allocEvent_0"] = Module["asm"]["rd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_allocStyle_0 = Module["_emscripten_bind_SubtitleOctopus_allocStyle_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_allocStyle_0 = Module["_emscripten_bind_SubtitleOctopus_allocStyle_0"] = Module["asm"]["sd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_removeEvent_1 = Module["_emscripten_bind_SubtitleOctopus_removeEvent_1"] = function () {
		return (_emscripten_bind_SubtitleOctopus_removeEvent_1 = Module["_emscripten_bind_SubtitleOctopus_removeEvent_1"] = Module["asm"]["td"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_getStyleCount_0 = Module["_emscripten_bind_SubtitleOctopus_getStyleCount_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_getStyleCount_0 = Module["_emscripten_bind_SubtitleOctopus_getStyleCount_0"] = Module["asm"]["ud"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_getStyleByName_1 = Module["_emscripten_bind_SubtitleOctopus_getStyleByName_1"] = function () {
		return (_emscripten_bind_SubtitleOctopus_getStyleByName_1 = Module["_emscripten_bind_SubtitleOctopus_getStyleByName_1"] = Module["asm"]["vd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_removeStyle_1 = Module["_emscripten_bind_SubtitleOctopus_removeStyle_1"] = function () {
		return (_emscripten_bind_SubtitleOctopus_removeStyle_1 = Module["_emscripten_bind_SubtitleOctopus_removeStyle_1"] = Module["asm"]["wd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_removeAllEvents_0 = Module["_emscripten_bind_SubtitleOctopus_removeAllEvents_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_removeAllEvents_0 = Module["_emscripten_bind_SubtitleOctopus_removeAllEvents_0"] = Module["asm"]["xd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_setMemoryLimits_2 = Module["_emscripten_bind_SubtitleOctopus_setMemoryLimits_2"] = function () {
		return (_emscripten_bind_SubtitleOctopus_setMemoryLimits_2 = Module["_emscripten_bind_SubtitleOctopus_setMemoryLimits_2"] = Module["asm"]["yd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_renderBlend_2 = Module["_emscripten_bind_SubtitleOctopus_renderBlend_2"] = function () {
		return (_emscripten_bind_SubtitleOctopus_renderBlend_2 = Module["_emscripten_bind_SubtitleOctopus_renderBlend_2"] = Module["asm"]["zd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_get_track_0 = Module["_emscripten_bind_SubtitleOctopus_get_track_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_get_track_0 = Module["_emscripten_bind_SubtitleOctopus_get_track_0"] = Module["asm"]["Ad"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_set_track_1 = Module["_emscripten_bind_SubtitleOctopus_set_track_1"] = function () {
		return (_emscripten_bind_SubtitleOctopus_set_track_1 = Module["_emscripten_bind_SubtitleOctopus_set_track_1"] = Module["asm"]["Bd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_get_ass_renderer_0 = Module["_emscripten_bind_SubtitleOctopus_get_ass_renderer_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_get_ass_renderer_0 = Module["_emscripten_bind_SubtitleOctopus_get_ass_renderer_0"] = Module["asm"]["Cd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_set_ass_renderer_1 = Module["_emscripten_bind_SubtitleOctopus_set_ass_renderer_1"] = function () {
		return (_emscripten_bind_SubtitleOctopus_set_ass_renderer_1 = Module["_emscripten_bind_SubtitleOctopus_set_ass_renderer_1"] = Module["asm"]["Dd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_get_ass_library_0 = Module["_emscripten_bind_SubtitleOctopus_get_ass_library_0"] = function () {
		return (_emscripten_bind_SubtitleOctopus_get_ass_library_0 = Module["_emscripten_bind_SubtitleOctopus_get_ass_library_0"] = Module["asm"]["Ed"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus_set_ass_library_1 = Module["_emscripten_bind_SubtitleOctopus_set_ass_library_1"] = function () {
		return (_emscripten_bind_SubtitleOctopus_set_ass_library_1 = Module["_emscripten_bind_SubtitleOctopus_set_ass_library_1"] = Module["asm"]["Fd"]).apply(null, arguments)
	};
	var _emscripten_bind_SubtitleOctopus___destroy___0 = Module["_emscripten_bind_SubtitleOctopus___destroy___0"] = function () {
		return (_emscripten_bind_SubtitleOctopus___destroy___0 = Module["_emscripten_bind_SubtitleOctopus___destroy___0"] = Module["asm"]["Gd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_Hinting_ASS_HINTING_NONE = Module["_emscripten_enum_ASS_Hinting_ASS_HINTING_NONE"] = function () {
		return (_emscripten_enum_ASS_Hinting_ASS_HINTING_NONE = Module["_emscripten_enum_ASS_Hinting_ASS_HINTING_NONE"] = Module["asm"]["Hd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_Hinting_ASS_HINTING_LIGHT = Module["_emscripten_enum_ASS_Hinting_ASS_HINTING_LIGHT"] = function () {
		return (_emscripten_enum_ASS_Hinting_ASS_HINTING_LIGHT = Module["_emscripten_enum_ASS_Hinting_ASS_HINTING_LIGHT"] = Module["asm"]["Id"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_Hinting_ASS_HINTING_NORMAL = Module["_emscripten_enum_ASS_Hinting_ASS_HINTING_NORMAL"] = function () {
		return (_emscripten_enum_ASS_Hinting_ASS_HINTING_NORMAL = Module["_emscripten_enum_ASS_Hinting_ASS_HINTING_NORMAL"] = Module["asm"]["Jd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_Hinting_ASS_HINTING_NATIVE = Module["_emscripten_enum_ASS_Hinting_ASS_HINTING_NATIVE"] = function () {
		return (_emscripten_enum_ASS_Hinting_ASS_HINTING_NATIVE = Module["_emscripten_enum_ASS_Hinting_ASS_HINTING_NATIVE"] = Module["asm"]["Kd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_SIMPLE = Module["_emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_SIMPLE"] = function () {
		return (_emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_SIMPLE = Module["_emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_SIMPLE"] = Module["asm"]["Ld"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_COMPLEX = Module["_emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_COMPLEX"] = function () {
		return (_emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_COMPLEX = Module["_emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_COMPLEX"] = Module["asm"]["Md"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_DEFAULT = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_DEFAULT"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_DEFAULT = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_DEFAULT"] = Module["asm"]["Nd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_STYLE = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_STYLE"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_STYLE = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_STYLE"] = Module["asm"]["Od"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_SELECTIVE_FONT_SCALE = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_SELECTIVE_FONT_SCALE"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_SELECTIVE_FONT_SCALE = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_SELECTIVE_FONT_SCALE"] = Module["asm"]["Pd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE"] = Module["asm"]["Qd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE_FIELDS = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE_FIELDS"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE_FIELDS = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE_FIELDS"] = Module["asm"]["Rd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_NAME = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_NAME"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_NAME = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_NAME"] = Module["asm"]["Sd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_COLORS = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_COLORS"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_COLORS = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_COLORS"] = Module["asm"]["Td"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ATTRIBUTES = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ATTRIBUTES"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ATTRIBUTES = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ATTRIBUTES"] = Module["asm"]["Ud"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_BORDER = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_BORDER"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_BORDER = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_BORDER"] = Module["asm"]["Vd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ALIGNMENT = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ALIGNMENT"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ALIGNMENT = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ALIGNMENT"] = Module["asm"]["Wd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_MARGINS = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_MARGINS"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_MARGINS = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_MARGINS"] = Module["asm"]["Xd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_FULL_STYLE = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_FULL_STYLE"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_FULL_STYLE = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_FULL_STYLE"] = Module["asm"]["Yd"]).apply(null, arguments)
	};
	var _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_JUSTIFY = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_JUSTIFY"] = function () {
		return (_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_JUSTIFY = Module["_emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_JUSTIFY"] = Module["asm"]["Zd"]).apply(null, arguments)
	};
	var ___errno_location = Module["___errno_location"] = function () {
		return (___errno_location = Module["___errno_location"] = Module["asm"]["$d"]).apply(null, arguments)
	};
	var _malloc = Module["_malloc"] = function () {
		return (_malloc = Module["_malloc"] = Module["asm"]["ae"]).apply(null, arguments)
	};
	var _emscripten_builtin_memalign = Module["_emscripten_builtin_memalign"] = function () {
		return (_emscripten_builtin_memalign = Module["_emscripten_builtin_memalign"] = Module["asm"]["be"]).apply(null, arguments)
	};
	var _setThrew = Module["_setThrew"] = function () {
		return (_setThrew = Module["_setThrew"] = Module["asm"]["ce"]).apply(null, arguments)
	};
	var stackSave = Module["stackSave"] = function () {
		return (stackSave = Module["stackSave"] = Module["asm"]["de"]).apply(null, arguments)
	};
	var stackRestore = Module["stackRestore"] = function () {
		return (stackRestore = Module["stackRestore"] = Module["asm"]["ee"]).apply(null, arguments)
	};
	var stackAlloc = Module["stackAlloc"] = function () {
		return (stackAlloc = Module["stackAlloc"] = Module["asm"]["fe"]).apply(null, arguments)
	};
	var ___emscripten_embedded_file_data = Module["___emscripten_embedded_file_data"] = 28896;

	function invoke_iii(index, a1, a2) {
		var sp = stackSave();
		try {
			return getWasmTableEntry(index)(a1, a2)
		} catch (e) {
			stackRestore(sp);
			if (e !== e + 0) throw e;
			_setThrew(1, 0)
		}
	}

	function invoke_iiiii(index, a1, a2, a3, a4) {
		var sp = stackSave();
		try {
			return getWasmTableEntry(index)(a1, a2, a3, a4)
		} catch (e) {
			stackRestore(sp);
			if (e !== e + 0) throw e;
			_setThrew(1, 0)
		}
	}

	function invoke_iiii(index, a1, a2, a3) {
		var sp = stackSave();
		try {
			return getWasmTableEntry(index)(a1, a2, a3)
		} catch (e) {
			stackRestore(sp);
			if (e !== e + 0) throw e;
			_setThrew(1, 0)
		}
	}
	Module["ccall"] = ccall;
	Module["cwrap"] = cwrap;
	Module["addRunDependency"] = addRunDependency;
	Module["removeRunDependency"] = removeRunDependency;
	Module["FS_createPath"] = FS.createPath;
	Module["FS_createDataFile"] = FS.createDataFile;
	Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
	Module["FS_createLazyFile"] = FS.createLazyFile;
	Module["FS_createDevice"] = FS.createDevice;
	Module["FS_unlink"] = FS.unlink;
	Module["getValue"] = getValue;
	var calledRun;

	function ExitStatus(status) {
		this.name = "ExitStatus";
		this.message = "Program terminated with exit(" + status + ")";
		this.status = status
	}
	var calledMain = false;
	dependenciesFulfilled = function runCaller() {
		if (!calledRun) run();
		if (!calledRun) dependenciesFulfilled = runCaller
	};

	function callMain(args) {
		var entryFunction = Module["_main"];
		args = args || [];
		args.unshift(thisProgram);
		var argc = args.length;
		var argv = stackAlloc((argc + 1) * 4);
		var argv_ptr = argv >> 2;
		args.forEach(arg => {
			HEAP32[argv_ptr++] = allocateUTF8OnStack(arg)
		});
		HEAP32[argv_ptr] = 0;
		try {
			var ret = entryFunction(argc, argv);
			exit(ret, true);
			return ret
		} catch (e) {
			return handleException(e)
		} finally {
			calledMain = true
		}
	}

	function run(args) {
		args = args || arguments_;
		if (runDependencies > 0) {
			return
		}
		preRun();
		if (runDependencies > 0) {
			return
		}

		function doRun() {
			if (calledRun) return;
			calledRun = true;
			Module["calledRun"] = true;
			if (ABORT) return;
			initRuntime();
			preMain();
			if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
			if (shouldRunNow) callMain(args);
			postRun()
		}
		if (Module["setStatus"]) {
			Module["setStatus"]("Running...");
			setTimeout(function () {
				setTimeout(function () {
					Module["setStatus"]("")
				}, 1);
				doRun()
			}, 1)
		} else {
			doRun()
		}
	}
	Module["run"] = run;

	function exit(status, implicit) {
		EXITSTATUS = status;
		procExit(status)
	}

	function procExit(code) {
		EXITSTATUS = code;
		if (!keepRuntimeAlive()) {
			if (Module["onExit"]) Module["onExit"](code);
			ABORT = true
		}
		quit_(code, new ExitStatus(code))
	}
	if (Module["preInit"]) {
		if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
		while (Module["preInit"].length > 0) {
			Module["preInit"].pop()()
		}
	}
	var shouldRunNow = true;
	if (Module["noInitialRun"]) shouldRunNow = false;
	run();

	function WrapperObject() {}
	WrapperObject.prototype = Object.create(WrapperObject.prototype);
	WrapperObject.prototype.constructor = WrapperObject;
	WrapperObject.prototype.__class__ = WrapperObject;
	WrapperObject.__cache__ = {};
	Module["WrapperObject"] = WrapperObject;

	function getCache(__class__) {
		return (__class__ || WrapperObject).__cache__
	}
	Module["getCache"] = getCache;

	function wrapPointer(ptr, __class__) {
		var cache = getCache(__class__);
		var ret = cache[ptr];
		if (ret) return ret;
		ret = Object.create((__class__ || WrapperObject).prototype);
		ret.ptr = ptr;
		return cache[ptr] = ret
	}
	Module["wrapPointer"] = wrapPointer;

	function castObject(obj, __class__) {
		return wrapPointer(obj.ptr, __class__)
	}
	Module["castObject"] = castObject;
	Module["NULL"] = wrapPointer(0);

	function destroy(obj) {
		if (!obj["__destroy__"]) throw "Error: Cannot destroy object. (Did you create it yourself?)";
		obj["__destroy__"]();
		delete getCache(obj.__class__)[obj.ptr]
	}
	Module["destroy"] = destroy;

	function compare(obj1, obj2) {
		return obj1.ptr === obj2.ptr
	}
	Module["compare"] = compare;

	function getPointer(obj) {
		return obj.ptr
	}
	Module["getPointer"] = getPointer;

	function getClass(obj) {
		return obj.__class__
	}
	Module["getClass"] = getClass;
	var ensureCache = {
		buffer: 0,
		size: 0,
		pos: 0,
		temps: [],
		owned: [],
		needed: 0,
		prepare: function () {
			if (ensureCache.needed) {
				for (var i = 0; i < ensureCache.temps.length; i++) {
					Module["_free"](ensureCache.temps[i])
				}
				ensureCache.temps.length = 0;
				Module["_free"](ensureCache.buffer);
				ensureCache.buffer = 0;
				ensureCache.size += ensureCache.needed;
				ensureCache.needed = 0
			}
			if (!ensureCache.buffer) {
				ensureCache.size += 128;
				ensureCache.buffer = Module["_malloc"](ensureCache.size);
				assert(ensureCache.buffer)
			}
			ensureCache.pos = 0
		},
		alloc: function (array, view, owner) {
			assert(ensureCache.buffer);
			var bytes = view.BYTES_PER_ELEMENT;
			var len = array.length * bytes;
			len = len + 7 & -8;
			var ret;
			if (owner) {
				assert(len > 0);
				ensureCache.needed += len;
				ret = Module["_malloc"](len);
				ensureCache.owned.push(ret)
			} else {
				if (ensureCache.pos + len >= ensureCache.size) {
					assert(len > 0);
					ensureCache.needed += len;
					ret = Module["_malloc"](len);
					ensureCache.temps.push(ret)
				} else {
					ret = ensureCache.buffer + ensureCache.pos;
					ensureCache.pos += len
				}
			}
			return ret
		},
		copy: function (array, view, offset) {
			offset >>>= 0;
			var bytes = view.BYTES_PER_ELEMENT;
			switch (bytes) {
				case 2:
					offset >>>= 1;
					break;
				case 4:
					offset >>>= 2;
					break;
				case 8:
					offset >>>= 3;
					break
			}
			for (var i = 0; i < array.length; i++) {
				view[offset + i] = array[i]
			}
		},
		clear: function (clearOwned) {
			for (var i = 0; i < ensureCache.temps.length; i++) {
				Module["_free"](ensureCache.temps[i])
			}
			if (clearOwned) {
				for (var i = 0; i < ensureCache.owned.length; i++) {
					Module["_free"](ensureCache.owned[i])
				}
			}
			ensureCache.temps.length = 0;
			Module["_free"](ensureCache.buffer);
			ensureCache.buffer = 0;
			ensureCache.size = 0;
			ensureCache.needed = 0
		}
	};

	function ensureString(value, owner) {
		if (typeof value === "string") {
			var intArray = intArrayFromString(value);
			var offset = ensureCache.alloc(intArray, HEAP8, owner);
			ensureCache.copy(intArray, HEAP8, offset);
			return offset
		}
		return value
	}

	function VoidPtr() {
		throw "cannot construct a VoidPtr, no constructor in IDL"
	}
	VoidPtr.prototype = Object.create(WrapperObject.prototype);
	VoidPtr.prototype.constructor = VoidPtr;
	VoidPtr.prototype.__class__ = VoidPtr;
	VoidPtr.__cache__ = {};
	Module["VoidPtr"] = VoidPtr;
	VoidPtr.prototype["__destroy__"] = VoidPtr.prototype.__destroy__ = function () {
		var self = this.ptr;
		_emscripten_bind_VoidPtr___destroy___0(self)
	};

	function ASS_Image() {
		throw "cannot construct a ASS_Image, no constructor in IDL"
	}
	ASS_Image.prototype = Object.create(WrapperObject.prototype);
	ASS_Image.prototype.constructor = ASS_Image;
	ASS_Image.prototype.__class__ = ASS_Image;
	ASS_Image.__cache__ = {};
	Module["ASS_Image"] = ASS_Image;
	ASS_Image.prototype["get_w"] = ASS_Image.prototype.get_w = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Image_get_w_0(self)
	};
	ASS_Image.prototype["set_w"] = ASS_Image.prototype.set_w = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Image_set_w_1(self, arg0)
	};
	Object.defineProperty(ASS_Image.prototype, "w", {
		get: ASS_Image.prototype.get_w,
		set: ASS_Image.prototype.set_w
	});
	ASS_Image.prototype["get_h"] = ASS_Image.prototype.get_h = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Image_get_h_0(self)
	};
	ASS_Image.prototype["set_h"] = ASS_Image.prototype.set_h = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Image_set_h_1(self, arg0)
	};
	Object.defineProperty(ASS_Image.prototype, "h", {
		get: ASS_Image.prototype.get_h,
		set: ASS_Image.prototype.set_h
	});
	ASS_Image.prototype["get_stride"] = ASS_Image.prototype.get_stride = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Image_get_stride_0(self)
	};
	ASS_Image.prototype["set_stride"] = ASS_Image.prototype.set_stride = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Image_set_stride_1(self, arg0)
	};
	Object.defineProperty(ASS_Image.prototype, "stride", {
		get: ASS_Image.prototype.get_stride,
		set: ASS_Image.prototype.set_stride
	});
	ASS_Image.prototype["get_bitmap"] = ASS_Image.prototype.get_bitmap = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Image_get_bitmap_0(self)
	};
	ASS_Image.prototype["set_bitmap"] = ASS_Image.prototype.set_bitmap = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, false);
		_emscripten_bind_ASS_Image_set_bitmap_1(self, arg0)
	};
	Object.defineProperty(ASS_Image.prototype, "bitmap", {
		get: ASS_Image.prototype.get_bitmap,
		set: ASS_Image.prototype.set_bitmap
	});
	ASS_Image.prototype["get_color"] = ASS_Image.prototype.get_color = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Image_get_color_0(self)
	};
	ASS_Image.prototype["set_color"] = ASS_Image.prototype.set_color = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Image_set_color_1(self, arg0)
	};
	Object.defineProperty(ASS_Image.prototype, "color", {
		get: ASS_Image.prototype.get_color,
		set: ASS_Image.prototype.set_color
	});
	ASS_Image.prototype["get_dst_x"] = ASS_Image.prototype.get_dst_x = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Image_get_dst_x_0(self)
	};
	ASS_Image.prototype["set_dst_x"] = ASS_Image.prototype.set_dst_x = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Image_set_dst_x_1(self, arg0)
	};
	Object.defineProperty(ASS_Image.prototype, "dst_x", {
		get: ASS_Image.prototype.get_dst_x,
		set: ASS_Image.prototype.set_dst_x
	});
	ASS_Image.prototype["get_dst_y"] = ASS_Image.prototype.get_dst_y = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Image_get_dst_y_0(self)
	};
	ASS_Image.prototype["set_dst_y"] = ASS_Image.prototype.set_dst_y = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Image_set_dst_y_1(self, arg0)
	};
	Object.defineProperty(ASS_Image.prototype, "dst_y", {
		get: ASS_Image.prototype.get_dst_y,
		set: ASS_Image.prototype.set_dst_y
	});
	ASS_Image.prototype["get_next"] = ASS_Image.prototype.get_next = function () {
		var self = this.ptr;
		return wrapPointer(_emscripten_bind_ASS_Image_get_next_0(self), ASS_Image)
	};
	ASS_Image.prototype["set_next"] = ASS_Image.prototype.set_next = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Image_set_next_1(self, arg0)
	};
	Object.defineProperty(ASS_Image.prototype, "next", {
		get: ASS_Image.prototype.get_next,
		set: ASS_Image.prototype.set_next
	});

	function ASS_Style() {
		throw "cannot construct a ASS_Style, no constructor in IDL"
	}
	ASS_Style.prototype = Object.create(WrapperObject.prototype);
	ASS_Style.prototype.constructor = ASS_Style;
	ASS_Style.prototype.__class__ = ASS_Style;
	ASS_Style.__cache__ = {};
	Module["ASS_Style"] = ASS_Style;
	ASS_Style.prototype["get_Name"] = ASS_Style.prototype.get_Name = function () {
		var self = this.ptr;
		return UTF8ToString(_emscripten_bind_ASS_Style_get_Name_0(self))
	};
	ASS_Style.prototype["set_Name"] = ASS_Style.prototype.set_Name = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, true);
		_emscripten_bind_ASS_Style_set_Name_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Name", {
		get: ASS_Style.prototype.get_Name,
		set: ASS_Style.prototype.set_Name
	});
	ASS_Style.prototype["get_FontName"] = ASS_Style.prototype.get_FontName = function () {
		var self = this.ptr;
		return UTF8ToString(_emscripten_bind_ASS_Style_get_FontName_0(self))
	};
	ASS_Style.prototype["set_FontName"] = ASS_Style.prototype.set_FontName = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, true);
		_emscripten_bind_ASS_Style_set_FontName_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "FontName", {
		get: ASS_Style.prototype.get_FontName,
		set: ASS_Style.prototype.set_FontName
	});
	ASS_Style.prototype["get_FontSize"] = ASS_Style.prototype.get_FontSize = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_FontSize_0(self)
	};
	ASS_Style.prototype["set_FontSize"] = ASS_Style.prototype.set_FontSize = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_FontSize_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "FontSize", {
		get: ASS_Style.prototype.get_FontSize,
		set: ASS_Style.prototype.set_FontSize
	});
	ASS_Style.prototype["get_PrimaryColour"] = ASS_Style.prototype.get_PrimaryColour = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_PrimaryColour_0(self)
	};
	ASS_Style.prototype["set_PrimaryColour"] = ASS_Style.prototype.set_PrimaryColour = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_PrimaryColour_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "PrimaryColour", {
		get: ASS_Style.prototype.get_PrimaryColour,
		set: ASS_Style.prototype.set_PrimaryColour
	});
	ASS_Style.prototype["get_SecondaryColour"] = ASS_Style.prototype.get_SecondaryColour = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_SecondaryColour_0(self)
	};
	ASS_Style.prototype["set_SecondaryColour"] = ASS_Style.prototype.set_SecondaryColour = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_SecondaryColour_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "SecondaryColour", {
		get: ASS_Style.prototype.get_SecondaryColour,
		set: ASS_Style.prototype.set_SecondaryColour
	});
	ASS_Style.prototype["get_OutlineColour"] = ASS_Style.prototype.get_OutlineColour = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_OutlineColour_0(self)
	};
	ASS_Style.prototype["set_OutlineColour"] = ASS_Style.prototype.set_OutlineColour = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_OutlineColour_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "OutlineColour", {
		get: ASS_Style.prototype.get_OutlineColour,
		set: ASS_Style.prototype.set_OutlineColour
	});
	ASS_Style.prototype["get_BackColour"] = ASS_Style.prototype.get_BackColour = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_BackColour_0(self)
	};
	ASS_Style.prototype["set_BackColour"] = ASS_Style.prototype.set_BackColour = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_BackColour_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "BackColour", {
		get: ASS_Style.prototype.get_BackColour,
		set: ASS_Style.prototype.set_BackColour
	});
	ASS_Style.prototype["get_Bold"] = ASS_Style.prototype.get_Bold = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Bold_0(self)
	};
	ASS_Style.prototype["set_Bold"] = ASS_Style.prototype.set_Bold = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Bold_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Bold", {
		get: ASS_Style.prototype.get_Bold,
		set: ASS_Style.prototype.set_Bold
	});
	ASS_Style.prototype["get_Italic"] = ASS_Style.prototype.get_Italic = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Italic_0(self)
	};
	ASS_Style.prototype["set_Italic"] = ASS_Style.prototype.set_Italic = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Italic_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Italic", {
		get: ASS_Style.prototype.get_Italic,
		set: ASS_Style.prototype.set_Italic
	});
	ASS_Style.prototype["get_Underline"] = ASS_Style.prototype.get_Underline = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Underline_0(self)
	};
	ASS_Style.prototype["set_Underline"] = ASS_Style.prototype.set_Underline = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Underline_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Underline", {
		get: ASS_Style.prototype.get_Underline,
		set: ASS_Style.prototype.set_Underline
	});
	ASS_Style.prototype["get_StrikeOut"] = ASS_Style.prototype.get_StrikeOut = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_StrikeOut_0(self)
	};
	ASS_Style.prototype["set_StrikeOut"] = ASS_Style.prototype.set_StrikeOut = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_StrikeOut_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "StrikeOut", {
		get: ASS_Style.prototype.get_StrikeOut,
		set: ASS_Style.prototype.set_StrikeOut
	});
	ASS_Style.prototype["get_ScaleX"] = ASS_Style.prototype.get_ScaleX = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_ScaleX_0(self)
	};
	ASS_Style.prototype["set_ScaleX"] = ASS_Style.prototype.set_ScaleX = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_ScaleX_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "ScaleX", {
		get: ASS_Style.prototype.get_ScaleX,
		set: ASS_Style.prototype.set_ScaleX
	});
	ASS_Style.prototype["get_ScaleY"] = ASS_Style.prototype.get_ScaleY = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_ScaleY_0(self)
	};
	ASS_Style.prototype["set_ScaleY"] = ASS_Style.prototype.set_ScaleY = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_ScaleY_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "ScaleY", {
		get: ASS_Style.prototype.get_ScaleY,
		set: ASS_Style.prototype.set_ScaleY
	});
	ASS_Style.prototype["get_Spacing"] = ASS_Style.prototype.get_Spacing = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Spacing_0(self)
	};
	ASS_Style.prototype["set_Spacing"] = ASS_Style.prototype.set_Spacing = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Spacing_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Spacing", {
		get: ASS_Style.prototype.get_Spacing,
		set: ASS_Style.prototype.set_Spacing
	});
	ASS_Style.prototype["get_Angle"] = ASS_Style.prototype.get_Angle = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Angle_0(self)
	};
	ASS_Style.prototype["set_Angle"] = ASS_Style.prototype.set_Angle = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Angle_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Angle", {
		get: ASS_Style.prototype.get_Angle,
		set: ASS_Style.prototype.set_Angle
	});
	ASS_Style.prototype["get_BorderStyle"] = ASS_Style.prototype.get_BorderStyle = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_BorderStyle_0(self)
	};
	ASS_Style.prototype["set_BorderStyle"] = ASS_Style.prototype.set_BorderStyle = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_BorderStyle_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "BorderStyle", {
		get: ASS_Style.prototype.get_BorderStyle,
		set: ASS_Style.prototype.set_BorderStyle
	});
	ASS_Style.prototype["get_Outline"] = ASS_Style.prototype.get_Outline = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Outline_0(self)
	};
	ASS_Style.prototype["set_Outline"] = ASS_Style.prototype.set_Outline = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Outline_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Outline", {
		get: ASS_Style.prototype.get_Outline,
		set: ASS_Style.prototype.set_Outline
	});
	ASS_Style.prototype["get_Shadow"] = ASS_Style.prototype.get_Shadow = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Shadow_0(self)
	};
	ASS_Style.prototype["set_Shadow"] = ASS_Style.prototype.set_Shadow = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Shadow_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Shadow", {
		get: ASS_Style.prototype.get_Shadow,
		set: ASS_Style.prototype.set_Shadow
	});
	ASS_Style.prototype["get_Alignment"] = ASS_Style.prototype.get_Alignment = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Alignment_0(self)
	};
	ASS_Style.prototype["set_Alignment"] = ASS_Style.prototype.set_Alignment = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Alignment_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Alignment", {
		get: ASS_Style.prototype.get_Alignment,
		set: ASS_Style.prototype.set_Alignment
	});
	ASS_Style.prototype["get_MarginL"] = ASS_Style.prototype.get_MarginL = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_MarginL_0(self)
	};
	ASS_Style.prototype["set_MarginL"] = ASS_Style.prototype.set_MarginL = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_MarginL_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "MarginL", {
		get: ASS_Style.prototype.get_MarginL,
		set: ASS_Style.prototype.set_MarginL
	});
	ASS_Style.prototype["get_MarginR"] = ASS_Style.prototype.get_MarginR = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_MarginR_0(self)
	};
	ASS_Style.prototype["set_MarginR"] = ASS_Style.prototype.set_MarginR = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_MarginR_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "MarginR", {
		get: ASS_Style.prototype.get_MarginR,
		set: ASS_Style.prototype.set_MarginR
	});
	ASS_Style.prototype["get_MarginV"] = ASS_Style.prototype.get_MarginV = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_MarginV_0(self)
	};
	ASS_Style.prototype["set_MarginV"] = ASS_Style.prototype.set_MarginV = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_MarginV_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "MarginV", {
		get: ASS_Style.prototype.get_MarginV,
		set: ASS_Style.prototype.set_MarginV
	});
	ASS_Style.prototype["get_Encoding"] = ASS_Style.prototype.get_Encoding = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Encoding_0(self)
	};
	ASS_Style.prototype["set_Encoding"] = ASS_Style.prototype.set_Encoding = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Encoding_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Encoding", {
		get: ASS_Style.prototype.get_Encoding,
		set: ASS_Style.prototype.set_Encoding
	});
	ASS_Style.prototype["get_treat_fontname_as_pattern"] = ASS_Style.prototype.get_treat_fontname_as_pattern = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_treat_fontname_as_pattern_0(self)
	};
	ASS_Style.prototype["set_treat_fontname_as_pattern"] = ASS_Style.prototype.set_treat_fontname_as_pattern = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_treat_fontname_as_pattern_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "treat_fontname_as_pattern", {
		get: ASS_Style.prototype.get_treat_fontname_as_pattern,
		set: ASS_Style.prototype.set_treat_fontname_as_pattern
	});
	ASS_Style.prototype["get_Blur"] = ASS_Style.prototype.get_Blur = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Blur_0(self)
	};
	ASS_Style.prototype["set_Blur"] = ASS_Style.prototype.set_Blur = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Blur_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Blur", {
		get: ASS_Style.prototype.get_Blur,
		set: ASS_Style.prototype.set_Blur
	});
	ASS_Style.prototype["get_Justify"] = ASS_Style.prototype.get_Justify = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Style_get_Justify_0(self)
	};
	ASS_Style.prototype["set_Justify"] = ASS_Style.prototype.set_Justify = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Style_set_Justify_1(self, arg0)
	};
	Object.defineProperty(ASS_Style.prototype, "Justify", {
		get: ASS_Style.prototype.get_Justify,
		set: ASS_Style.prototype.set_Justify
	});

	function ASS_Event() {
		throw "cannot construct a ASS_Event, no constructor in IDL"
	}
	ASS_Event.prototype = Object.create(WrapperObject.prototype);
	ASS_Event.prototype.constructor = ASS_Event;
	ASS_Event.prototype.__class__ = ASS_Event;
	ASS_Event.__cache__ = {};
	Module["ASS_Event"] = ASS_Event;
	ASS_Event.prototype["get_Start"] = ASS_Event.prototype.get_Start = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Event_get_Start_0(self)
	};
	ASS_Event.prototype["set_Start"] = ASS_Event.prototype.set_Start = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Event_set_Start_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "Start", {
		get: ASS_Event.prototype.get_Start,
		set: ASS_Event.prototype.set_Start
	});
	ASS_Event.prototype["get_Duration"] = ASS_Event.prototype.get_Duration = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Event_get_Duration_0(self)
	};
	ASS_Event.prototype["set_Duration"] = ASS_Event.prototype.set_Duration = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Event_set_Duration_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "Duration", {
		get: ASS_Event.prototype.get_Duration,
		set: ASS_Event.prototype.set_Duration
	});
	ASS_Event.prototype["get_ReadOrder"] = ASS_Event.prototype.get_ReadOrder = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Event_get_ReadOrder_0(self)
	};
	ASS_Event.prototype["set_ReadOrder"] = ASS_Event.prototype.set_ReadOrder = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Event_set_ReadOrder_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "ReadOrder", {
		get: ASS_Event.prototype.get_ReadOrder,
		set: ASS_Event.prototype.set_ReadOrder
	});
	ASS_Event.prototype["get_Layer"] = ASS_Event.prototype.get_Layer = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Event_get_Layer_0(self)
	};
	ASS_Event.prototype["set_Layer"] = ASS_Event.prototype.set_Layer = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Event_set_Layer_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "Layer", {
		get: ASS_Event.prototype.get_Layer,
		set: ASS_Event.prototype.set_Layer
	});
	ASS_Event.prototype["get_Style"] = ASS_Event.prototype.get_Style = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Event_get_Style_0(self)
	};
	ASS_Event.prototype["set_Style"] = ASS_Event.prototype.set_Style = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Event_set_Style_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "Style", {
		get: ASS_Event.prototype.get_Style,
		set: ASS_Event.prototype.set_Style
	});
	ASS_Event.prototype["get_Name"] = ASS_Event.prototype.get_Name = function () {
		var self = this.ptr;
		return UTF8ToString(_emscripten_bind_ASS_Event_get_Name_0(self))
	};
	ASS_Event.prototype["set_Name"] = ASS_Event.prototype.set_Name = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, true);
		_emscripten_bind_ASS_Event_set_Name_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "Name", {
		get: ASS_Event.prototype.get_Name,
		set: ASS_Event.prototype.set_Name
	});
	ASS_Event.prototype["get_MarginL"] = ASS_Event.prototype.get_MarginL = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Event_get_MarginL_0(self)
	};
	ASS_Event.prototype["set_MarginL"] = ASS_Event.prototype.set_MarginL = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Event_set_MarginL_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "MarginL", {
		get: ASS_Event.prototype.get_MarginL,
		set: ASS_Event.prototype.set_MarginL
	});
	ASS_Event.prototype["get_MarginR"] = ASS_Event.prototype.get_MarginR = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Event_get_MarginR_0(self)
	};
	ASS_Event.prototype["set_MarginR"] = ASS_Event.prototype.set_MarginR = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Event_set_MarginR_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "MarginR", {
		get: ASS_Event.prototype.get_MarginR,
		set: ASS_Event.prototype.set_MarginR
	});
	ASS_Event.prototype["get_MarginV"] = ASS_Event.prototype.get_MarginV = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Event_get_MarginV_0(self)
	};
	ASS_Event.prototype["set_MarginV"] = ASS_Event.prototype.set_MarginV = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Event_set_MarginV_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "MarginV", {
		get: ASS_Event.prototype.get_MarginV,
		set: ASS_Event.prototype.set_MarginV
	});
	ASS_Event.prototype["get_Effect"] = ASS_Event.prototype.get_Effect = function () {
		var self = this.ptr;
		return UTF8ToString(_emscripten_bind_ASS_Event_get_Effect_0(self))
	};
	ASS_Event.prototype["set_Effect"] = ASS_Event.prototype.set_Effect = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, true);
		_emscripten_bind_ASS_Event_set_Effect_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "Effect", {
		get: ASS_Event.prototype.get_Effect,
		set: ASS_Event.prototype.set_Effect
	});
	ASS_Event.prototype["get_Text"] = ASS_Event.prototype.get_Text = function () {
		var self = this.ptr;
		return UTF8ToString(_emscripten_bind_ASS_Event_get_Text_0(self))
	};
	ASS_Event.prototype["set_Text"] = ASS_Event.prototype.set_Text = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, true);
		_emscripten_bind_ASS_Event_set_Text_1(self, arg0)
	};
	Object.defineProperty(ASS_Event.prototype, "Text", {
		get: ASS_Event.prototype.get_Text,
		set: ASS_Event.prototype.set_Text
	});

	function ASS_Track() {
		throw "cannot construct a ASS_Track, no constructor in IDL"
	}
	ASS_Track.prototype = Object.create(WrapperObject.prototype);
	ASS_Track.prototype.constructor = ASS_Track;
	ASS_Track.prototype.__class__ = ASS_Track;
	ASS_Track.__cache__ = {};
	Module["ASS_Track"] = ASS_Track;
	ASS_Track.prototype["get_n_styles"] = ASS_Track.prototype.get_n_styles = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_n_styles_0(self)
	};
	ASS_Track.prototype["set_n_styles"] = ASS_Track.prototype.set_n_styles = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_n_styles_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "n_styles", {
		get: ASS_Track.prototype.get_n_styles,
		set: ASS_Track.prototype.set_n_styles
	});
	ASS_Track.prototype["get_max_styles"] = ASS_Track.prototype.get_max_styles = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_max_styles_0(self)
	};
	ASS_Track.prototype["set_max_styles"] = ASS_Track.prototype.set_max_styles = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_max_styles_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "max_styles", {
		get: ASS_Track.prototype.get_max_styles,
		set: ASS_Track.prototype.set_max_styles
	});
	ASS_Track.prototype["get_n_events"] = ASS_Track.prototype.get_n_events = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_n_events_0(self)
	};
	ASS_Track.prototype["set_n_events"] = ASS_Track.prototype.set_n_events = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_n_events_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "n_events", {
		get: ASS_Track.prototype.get_n_events,
		set: ASS_Track.prototype.set_n_events
	});
	ASS_Track.prototype["get_max_events"] = ASS_Track.prototype.get_max_events = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_max_events_0(self)
	};
	ASS_Track.prototype["set_max_events"] = ASS_Track.prototype.set_max_events = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_max_events_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "max_events", {
		get: ASS_Track.prototype.get_max_events,
		set: ASS_Track.prototype.set_max_events
	});
	ASS_Track.prototype["get_styles"] = ASS_Track.prototype.get_styles = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		return wrapPointer(_emscripten_bind_ASS_Track_get_styles_1(self, arg0), ASS_Style)
	};
	ASS_Track.prototype["set_styles"] = ASS_Track.prototype.set_styles = function (arg0, arg1) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		if (arg1 && typeof arg1 === "object") arg1 = arg1.ptr;
		_emscripten_bind_ASS_Track_set_styles_2(self, arg0, arg1)
	};
	Object.defineProperty(ASS_Track.prototype, "styles", {
		get: ASS_Track.prototype.get_styles,
		set: ASS_Track.prototype.set_styles
	});
	ASS_Track.prototype["get_events"] = ASS_Track.prototype.get_events = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		return wrapPointer(_emscripten_bind_ASS_Track_get_events_1(self, arg0), ASS_Event)
	};
	ASS_Track.prototype["set_events"] = ASS_Track.prototype.set_events = function (arg0, arg1) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		if (arg1 && typeof arg1 === "object") arg1 = arg1.ptr;
		_emscripten_bind_ASS_Track_set_events_2(self, arg0, arg1)
	};
	Object.defineProperty(ASS_Track.prototype, "events", {
		get: ASS_Track.prototype.get_events,
		set: ASS_Track.prototype.set_events
	});
	ASS_Track.prototype["get_style_format"] = ASS_Track.prototype.get_style_format = function () {
		var self = this.ptr;
		return UTF8ToString(_emscripten_bind_ASS_Track_get_style_format_0(self))
	};
	ASS_Track.prototype["set_style_format"] = ASS_Track.prototype.set_style_format = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, true);
		_emscripten_bind_ASS_Track_set_style_format_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "style_format", {
		get: ASS_Track.prototype.get_style_format,
		set: ASS_Track.prototype.set_style_format
	});
	ASS_Track.prototype["get_event_format"] = ASS_Track.prototype.get_event_format = function () {
		var self = this.ptr;
		return UTF8ToString(_emscripten_bind_ASS_Track_get_event_format_0(self))
	};
	ASS_Track.prototype["set_event_format"] = ASS_Track.prototype.set_event_format = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, true);
		_emscripten_bind_ASS_Track_set_event_format_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "event_format", {
		get: ASS_Track.prototype.get_event_format,
		set: ASS_Track.prototype.set_event_format
	});
	ASS_Track.prototype["get_PlayResX"] = ASS_Track.prototype.get_PlayResX = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_PlayResX_0(self)
	};
	ASS_Track.prototype["set_PlayResX"] = ASS_Track.prototype.set_PlayResX = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_PlayResX_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "PlayResX", {
		get: ASS_Track.prototype.get_PlayResX,
		set: ASS_Track.prototype.set_PlayResX
	});
	ASS_Track.prototype["get_PlayResY"] = ASS_Track.prototype.get_PlayResY = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_PlayResY_0(self)
	};
	ASS_Track.prototype["set_PlayResY"] = ASS_Track.prototype.set_PlayResY = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_PlayResY_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "PlayResY", {
		get: ASS_Track.prototype.get_PlayResY,
		set: ASS_Track.prototype.set_PlayResY
	});
	ASS_Track.prototype["get_Timer"] = ASS_Track.prototype.get_Timer = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_Timer_0(self)
	};
	ASS_Track.prototype["set_Timer"] = ASS_Track.prototype.set_Timer = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_Timer_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "Timer", {
		get: ASS_Track.prototype.get_Timer,
		set: ASS_Track.prototype.set_Timer
	});
	ASS_Track.prototype["get_WrapStyle"] = ASS_Track.prototype.get_WrapStyle = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_WrapStyle_0(self)
	};
	ASS_Track.prototype["set_WrapStyle"] = ASS_Track.prototype.set_WrapStyle = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_WrapStyle_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "WrapStyle", {
		get: ASS_Track.prototype.get_WrapStyle,
		set: ASS_Track.prototype.set_WrapStyle
	});
	ASS_Track.prototype["get_ScaledBorderAndShadow"] = ASS_Track.prototype.get_ScaledBorderAndShadow = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_ScaledBorderAndShadow_0(self)
	};
	ASS_Track.prototype["set_ScaledBorderAndShadow"] = ASS_Track.prototype.set_ScaledBorderAndShadow = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_ScaledBorderAndShadow_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "ScaledBorderAndShadow", {
		get: ASS_Track.prototype.get_ScaledBorderAndShadow,
		set: ASS_Track.prototype.set_ScaledBorderAndShadow
	});
	ASS_Track.prototype["get_Kerning"] = ASS_Track.prototype.get_Kerning = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_Kerning_0(self)
	};
	ASS_Track.prototype["set_Kerning"] = ASS_Track.prototype.set_Kerning = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_Kerning_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "Kerning", {
		get: ASS_Track.prototype.get_Kerning,
		set: ASS_Track.prototype.set_Kerning
	});
	ASS_Track.prototype["get_Language"] = ASS_Track.prototype.get_Language = function () {
		var self = this.ptr;
		return UTF8ToString(_emscripten_bind_ASS_Track_get_Language_0(self))
	};
	ASS_Track.prototype["set_Language"] = ASS_Track.prototype.set_Language = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, true);
		_emscripten_bind_ASS_Track_set_Language_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "Language", {
		get: ASS_Track.prototype.get_Language,
		set: ASS_Track.prototype.set_Language
	});
	ASS_Track.prototype["get_default_style"] = ASS_Track.prototype.get_default_style = function () {
		var self = this.ptr;
		return _emscripten_bind_ASS_Track_get_default_style_0(self)
	};
	ASS_Track.prototype["set_default_style"] = ASS_Track.prototype.set_default_style = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_ASS_Track_set_default_style_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "default_style", {
		get: ASS_Track.prototype.get_default_style,
		set: ASS_Track.prototype.set_default_style
	});
	ASS_Track.prototype["get_name"] = ASS_Track.prototype.get_name = function () {
		var self = this.ptr;
		return UTF8ToString(_emscripten_bind_ASS_Track_get_name_0(self))
	};
	ASS_Track.prototype["set_name"] = ASS_Track.prototype.set_name = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, true);
		_emscripten_bind_ASS_Track_set_name_1(self, arg0)
	};
	Object.defineProperty(ASS_Track.prototype, "name", {
		get: ASS_Track.prototype.get_name,
		set: ASS_Track.prototype.set_name
	});

	function ASS_Library() {
		throw "cannot construct a ASS_Library, no constructor in IDL"
	}
	ASS_Library.prototype = Object.create(WrapperObject.prototype);
	ASS_Library.prototype.constructor = ASS_Library;
	ASS_Library.prototype.__class__ = ASS_Library;
	ASS_Library.__cache__ = {};
	Module["ASS_Library"] = ASS_Library;

	function ASS_RenderPriv() {
		throw "cannot construct a ASS_RenderPriv, no constructor in IDL"
	}
	ASS_RenderPriv.prototype = Object.create(WrapperObject.prototype);
	ASS_RenderPriv.prototype.constructor = ASS_RenderPriv;
	ASS_RenderPriv.prototype.__class__ = ASS_RenderPriv;
	ASS_RenderPriv.__cache__ = {};
	Module["ASS_RenderPriv"] = ASS_RenderPriv;

	function ASS_ParserPriv() {
		throw "cannot construct a ASS_ParserPriv, no constructor in IDL"
	}
	ASS_ParserPriv.prototype = Object.create(WrapperObject.prototype);
	ASS_ParserPriv.prototype.constructor = ASS_ParserPriv;
	ASS_ParserPriv.prototype.__class__ = ASS_ParserPriv;
	ASS_ParserPriv.__cache__ = {};
	Module["ASS_ParserPriv"] = ASS_ParserPriv;

	function ASS_Renderer() {
		throw "cannot construct a ASS_Renderer, no constructor in IDL"
	}
	ASS_Renderer.prototype = Object.create(WrapperObject.prototype);
	ASS_Renderer.prototype.constructor = ASS_Renderer;
	ASS_Renderer.prototype.__class__ = ASS_Renderer;
	ASS_Renderer.__cache__ = {};
	Module["ASS_Renderer"] = ASS_Renderer;

	function libass() {
		this.ptr = _emscripten_bind_libass_libass_0();
		getCache(libass)[this.ptr] = this
	}
	libass.prototype = Object.create(WrapperObject.prototype);
	libass.prototype.constructor = libass;
	libass.prototype.__class__ = libass;
	libass.__cache__ = {};
	Module["libass"] = libass;
	libass.prototype["oct_library_version"] = libass.prototype.oct_library_version = function () {
		var self = this.ptr;
		return _emscripten_bind_libass_oct_library_version_0(self)
	};
	libass.prototype["oct_library_init"] = libass.prototype.oct_library_init = function () {
		var self = this.ptr;
		return wrapPointer(_emscripten_bind_libass_oct_library_init_0(self), ASS_Library)
	};
	libass.prototype["oct_library_done"] = libass.prototype.oct_library_done = function (priv) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		_emscripten_bind_libass_oct_library_done_1(self, priv)
	};
	libass.prototype["oct_set_fonts_dir"] = libass.prototype.oct_set_fonts_dir = function (priv, fonts_dir) {
		var self = this.ptr;
		ensureCache.prepare();
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (fonts_dir && typeof fonts_dir === "object") fonts_dir = fonts_dir.ptr;
		else fonts_dir = ensureString(fonts_dir, false);
		_emscripten_bind_libass_oct_set_fonts_dir_2(self, priv, fonts_dir)
	};
	libass.prototype["oct_set_extract_fonts"] = libass.prototype.oct_set_extract_fonts = function (priv, extract) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (extract && typeof extract === "object") extract = extract.ptr;
		_emscripten_bind_libass_oct_set_extract_fonts_2(self, priv, extract)
	};
	libass.prototype["oct_set_style_overrides"] = libass.prototype.oct_set_style_overrides = function (priv, list) {
		var self = this.ptr;
		ensureCache.prepare();
		if (priv && typeof priv === "object") priv = priv.ptr;
		_emscripten_bind_libass_oct_set_style_overrides_2(self, priv, list)
	};
	libass.prototype["oct_process_force_style"] = libass.prototype.oct_process_force_style = function (track) {
		var self = this.ptr;
		if (track && typeof track === "object") track = track.ptr;
		_emscripten_bind_libass_oct_process_force_style_1(self, track)
	};
	libass.prototype["oct_renderer_init"] = libass.prototype.oct_renderer_init = function (priv) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		return wrapPointer(_emscripten_bind_libass_oct_renderer_init_1(self, priv), ASS_Renderer)
	};
	libass.prototype["oct_renderer_done"] = libass.prototype.oct_renderer_done = function (priv) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		_emscripten_bind_libass_oct_renderer_done_1(self, priv)
	};
	libass.prototype["oct_set_frame_size"] = libass.prototype.oct_set_frame_size = function (priv, w, h) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (w && typeof w === "object") w = w.ptr;
		if (h && typeof h === "object") h = h.ptr;
		_emscripten_bind_libass_oct_set_frame_size_3(self, priv, w, h)
	};
	libass.prototype["oct_set_storage_size"] = libass.prototype.oct_set_storage_size = function (priv, w, h) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (w && typeof w === "object") w = w.ptr;
		if (h && typeof h === "object") h = h.ptr;
		_emscripten_bind_libass_oct_set_storage_size_3(self, priv, w, h)
	};
	libass.prototype["oct_set_shaper"] = libass.prototype.oct_set_shaper = function (priv, level) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (level && typeof level === "object") level = level.ptr;
		_emscripten_bind_libass_oct_set_shaper_2(self, priv, level)
	};
	libass.prototype["oct_set_margins"] = libass.prototype.oct_set_margins = function (priv, t, b, l, r) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (t && typeof t === "object") t = t.ptr;
		if (b && typeof b === "object") b = b.ptr;
		if (l && typeof l === "object") l = l.ptr;
		if (r && typeof r === "object") r = r.ptr;
		_emscripten_bind_libass_oct_set_margins_5(self, priv, t, b, l, r)
	};
	libass.prototype["oct_set_use_margins"] = libass.prototype.oct_set_use_margins = function (priv, use) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (use && typeof use === "object") use = use.ptr;
		_emscripten_bind_libass_oct_set_use_margins_2(self, priv, use)
	};
	libass.prototype["oct_set_pixel_aspect"] = libass.prototype.oct_set_pixel_aspect = function (priv, par) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (par && typeof par === "object") par = par.ptr;
		_emscripten_bind_libass_oct_set_pixel_aspect_2(self, priv, par)
	};
	libass.prototype["oct_set_aspect_ratio"] = libass.prototype.oct_set_aspect_ratio = function (priv, dar, sar) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (dar && typeof dar === "object") dar = dar.ptr;
		if (sar && typeof sar === "object") sar = sar.ptr;
		_emscripten_bind_libass_oct_set_aspect_ratio_3(self, priv, dar, sar)
	};
	libass.prototype["oct_set_font_scale"] = libass.prototype.oct_set_font_scale = function (priv, font_scale) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (font_scale && typeof font_scale === "object") font_scale = font_scale.ptr;
		_emscripten_bind_libass_oct_set_font_scale_2(self, priv, font_scale)
	};
	libass.prototype["oct_set_hinting"] = libass.prototype.oct_set_hinting = function (priv, ht) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (ht && typeof ht === "object") ht = ht.ptr;
		_emscripten_bind_libass_oct_set_hinting_2(self, priv, ht)
	};
	libass.prototype["oct_set_line_spacing"] = libass.prototype.oct_set_line_spacing = function (priv, line_spacing) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (line_spacing && typeof line_spacing === "object") line_spacing = line_spacing.ptr;
		_emscripten_bind_libass_oct_set_line_spacing_2(self, priv, line_spacing)
	};
	libass.prototype["oct_set_line_position"] = libass.prototype.oct_set_line_position = function (priv, line_position) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (line_position && typeof line_position === "object") line_position = line_position.ptr;
		_emscripten_bind_libass_oct_set_line_position_2(self, priv, line_position)
	};
	libass.prototype["oct_set_fonts"] = libass.prototype.oct_set_fonts = function (priv, default_font, default_family, dfp, config, update) {
		var self = this.ptr;
		ensureCache.prepare();
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (default_font && typeof default_font === "object") default_font = default_font.ptr;
		else default_font = ensureString(default_font, false);
		if (default_family && typeof default_family === "object") default_family = default_family.ptr;
		else default_family = ensureString(default_family, false);
		if (dfp && typeof dfp === "object") dfp = dfp.ptr;
		if (config && typeof config === "object") config = config.ptr;
		else config = ensureString(config, false);
		if (update && typeof update === "object") update = update.ptr;
		_emscripten_bind_libass_oct_set_fonts_6(self, priv, default_font, default_family, dfp, config, update)
	};
	libass.prototype["oct_set_selective_style_override_enabled"] = libass.prototype.oct_set_selective_style_override_enabled = function (priv, bits) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (bits && typeof bits === "object") bits = bits.ptr;
		_emscripten_bind_libass_oct_set_selective_style_override_enabled_2(self, priv, bits)
	};
	libass.prototype["oct_set_selective_style_override"] = libass.prototype.oct_set_selective_style_override = function (priv, style) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (style && typeof style === "object") style = style.ptr;
		_emscripten_bind_libass_oct_set_selective_style_override_2(self, priv, style)
	};
	libass.prototype["oct_set_cache_limits"] = libass.prototype.oct_set_cache_limits = function (priv, glyph_max, bitmap_max_size) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (glyph_max && typeof glyph_max === "object") glyph_max = glyph_max.ptr;
		if (bitmap_max_size && typeof bitmap_max_size === "object") bitmap_max_size = bitmap_max_size.ptr;
		_emscripten_bind_libass_oct_set_cache_limits_3(self, priv, glyph_max, bitmap_max_size)
	};
	libass.prototype["oct_render_frame"] = libass.prototype.oct_render_frame = function (priv, track, now, detect_change) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		if (track && typeof track === "object") track = track.ptr;
		if (now && typeof now === "object") now = now.ptr;
		if (detect_change && typeof detect_change === "object") detect_change = detect_change.ptr;
		return wrapPointer(_emscripten_bind_libass_oct_render_frame_4(self, priv, track, now, detect_change), ASS_Image)
	};
	libass.prototype["oct_new_track"] = libass.prototype.oct_new_track = function (priv) {
		var self = this.ptr;
		if (priv && typeof priv === "object") priv = priv.ptr;
		return wrapPointer(_emscripten_bind_libass_oct_new_track_1(self, priv), ASS_Track)
	};
	libass.prototype["oct_free_track"] = libass.prototype.oct_free_track = function (track) {
		var self = this.ptr;
		if (track && typeof track === "object") track = track.ptr;
		_emscripten_bind_libass_oct_free_track_1(self, track)
	};
	libass.prototype["oct_alloc_style"] = libass.prototype.oct_alloc_style = function (track) {
		var self = this.ptr;
		if (track && typeof track === "object") track = track.ptr;
		return _emscripten_bind_libass_oct_alloc_style_1(self, track)
	};
	libass.prototype["oct_alloc_event"] = libass.prototype.oct_alloc_event = function (track) {
		var self = this.ptr;
		if (track && typeof track === "object") track = track.ptr;
		return _emscripten_bind_libass_oct_alloc_event_1(self, track)
	};
	libass.prototype["oct_free_style"] = libass.prototype.oct_free_style = function (track, sid) {
		var self = this.ptr;
		if (track && typeof track === "object") track = track.ptr;
		if (sid && typeof sid === "object") sid = sid.ptr;
		_emscripten_bind_libass_oct_free_style_2(self, track, sid)
	};
	libass.prototype["oct_free_event"] = libass.prototype.oct_free_event = function (track, eid) {
		var self = this.ptr;
		if (track && typeof track === "object") track = track.ptr;
		if (eid && typeof eid === "object") eid = eid.ptr;
		_emscripten_bind_libass_oct_free_event_2(self, track, eid)
	};
	libass.prototype["oct_flush_events"] = libass.prototype.oct_flush_events = function (track) {
		var self = this.ptr;
		if (track && typeof track === "object") track = track.ptr;
		_emscripten_bind_libass_oct_flush_events_1(self, track)
	};
	libass.prototype["oct_read_file"] = libass.prototype.oct_read_file = function (library, fname, codepage) {
		var self = this.ptr;
		ensureCache.prepare();
		if (library && typeof library === "object") library = library.ptr;
		if (fname && typeof fname === "object") fname = fname.ptr;
		else fname = ensureString(fname, false);
		if (codepage && typeof codepage === "object") codepage = codepage.ptr;
		else codepage = ensureString(codepage, false);
		return wrapPointer(_emscripten_bind_libass_oct_read_file_3(self, library, fname, codepage), ASS_Track)
	};
	libass.prototype["oct_add_font"] = libass.prototype.oct_add_font = function (library, name, data, data_size) {
		var self = this.ptr;
		ensureCache.prepare();
		if (library && typeof library === "object") library = library.ptr;
		if (name && typeof name === "object") name = name.ptr;
		else name = ensureString(name, false);
		if (data && typeof data === "object") data = data.ptr;
		else data = ensureString(data, false);
		if (data_size && typeof data_size === "object") data_size = data_size.ptr;
		_emscripten_bind_libass_oct_add_font_4(self, library, name, data, data_size)
	};
	libass.prototype["oct_clear_fonts"] = libass.prototype.oct_clear_fonts = function (library) {
		var self = this.ptr;
		if (library && typeof library === "object") library = library.ptr;
		_emscripten_bind_libass_oct_clear_fonts_1(self, library)
	};
	libass.prototype["oct_step_sub"] = libass.prototype.oct_step_sub = function (track, now, movement) {
		var self = this.ptr;
		if (track && typeof track === "object") track = track.ptr;
		if (now && typeof now === "object") now = now.ptr;
		if (movement && typeof movement === "object") movement = movement.ptr;
		return _emscripten_bind_libass_oct_step_sub_3(self, track, now, movement)
	};

	function RenderBlendResult() {
		throw "cannot construct a RenderBlendResult, no constructor in IDL"
	}
	RenderBlendResult.prototype = Object.create(WrapperObject.prototype);
	RenderBlendResult.prototype.constructor = RenderBlendResult;
	RenderBlendResult.prototype.__class__ = RenderBlendResult;
	RenderBlendResult.__cache__ = {};
	Module["RenderBlendResult"] = RenderBlendResult;
	RenderBlendResult.prototype["get_changed"] = RenderBlendResult.prototype.get_changed = function () {
		var self = this.ptr;
		return _emscripten_bind_RenderBlendResult_get_changed_0(self)
	};
	RenderBlendResult.prototype["set_changed"] = RenderBlendResult.prototype.set_changed = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_RenderBlendResult_set_changed_1(self, arg0)
	};
	Object.defineProperty(RenderBlendResult.prototype, "changed", {
		get: RenderBlendResult.prototype.get_changed,
		set: RenderBlendResult.prototype.set_changed
	});
	RenderBlendResult.prototype["get_blend_time"] = RenderBlendResult.prototype.get_blend_time = function () {
		var self = this.ptr;
		return _emscripten_bind_RenderBlendResult_get_blend_time_0(self)
	};
	RenderBlendResult.prototype["set_blend_time"] = RenderBlendResult.prototype.set_blend_time = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_RenderBlendResult_set_blend_time_1(self, arg0)
	};
	Object.defineProperty(RenderBlendResult.prototype, "blend_time", {
		get: RenderBlendResult.prototype.get_blend_time,
		set: RenderBlendResult.prototype.set_blend_time
	});
	RenderBlendResult.prototype["get_dest_x"] = RenderBlendResult.prototype.get_dest_x = function () {
		var self = this.ptr;
		return _emscripten_bind_RenderBlendResult_get_dest_x_0(self)
	};
	RenderBlendResult.prototype["set_dest_x"] = RenderBlendResult.prototype.set_dest_x = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_RenderBlendResult_set_dest_x_1(self, arg0)
	};
	Object.defineProperty(RenderBlendResult.prototype, "dest_x", {
		get: RenderBlendResult.prototype.get_dest_x,
		set: RenderBlendResult.prototype.set_dest_x
	});
	RenderBlendResult.prototype["get_dest_y"] = RenderBlendResult.prototype.get_dest_y = function () {
		var self = this.ptr;
		return _emscripten_bind_RenderBlendResult_get_dest_y_0(self)
	};
	RenderBlendResult.prototype["set_dest_y"] = RenderBlendResult.prototype.set_dest_y = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_RenderBlendResult_set_dest_y_1(self, arg0)
	};
	Object.defineProperty(RenderBlendResult.prototype, "dest_y", {
		get: RenderBlendResult.prototype.get_dest_y,
		set: RenderBlendResult.prototype.set_dest_y
	});
	RenderBlendResult.prototype["get_dest_width"] = RenderBlendResult.prototype.get_dest_width = function () {
		var self = this.ptr;
		return _emscripten_bind_RenderBlendResult_get_dest_width_0(self)
	};
	RenderBlendResult.prototype["set_dest_width"] = RenderBlendResult.prototype.set_dest_width = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_RenderBlendResult_set_dest_width_1(self, arg0)
	};
	Object.defineProperty(RenderBlendResult.prototype, "dest_width", {
		get: RenderBlendResult.prototype.get_dest_width,
		set: RenderBlendResult.prototype.set_dest_width
	});
	RenderBlendResult.prototype["get_dest_height"] = RenderBlendResult.prototype.get_dest_height = function () {
		var self = this.ptr;
		return _emscripten_bind_RenderBlendResult_get_dest_height_0(self)
	};
	RenderBlendResult.prototype["set_dest_height"] = RenderBlendResult.prototype.set_dest_height = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_RenderBlendResult_set_dest_height_1(self, arg0)
	};
	Object.defineProperty(RenderBlendResult.prototype, "dest_height", {
		get: RenderBlendResult.prototype.get_dest_height,
		set: RenderBlendResult.prototype.set_dest_height
	});
	RenderBlendResult.prototype["get_image"] = RenderBlendResult.prototype.get_image = function () {
		var self = this.ptr;
		return _emscripten_bind_RenderBlendResult_get_image_0(self)
	};
	RenderBlendResult.prototype["set_image"] = RenderBlendResult.prototype.set_image = function (arg0) {
		var self = this.ptr;
		ensureCache.prepare();
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		else arg0 = ensureString(arg0, false);
		_emscripten_bind_RenderBlendResult_set_image_1(self, arg0)
	};
	Object.defineProperty(RenderBlendResult.prototype, "image", {
		get: RenderBlendResult.prototype.get_image,
		set: RenderBlendResult.prototype.set_image
	});

	function SubtitleOctopus() {
		this.ptr = _emscripten_bind_SubtitleOctopus_SubtitleOctopus_0();
		getCache(SubtitleOctopus)[this.ptr] = this
	}
	SubtitleOctopus.prototype = Object.create(WrapperObject.prototype);
	SubtitleOctopus.prototype.constructor = SubtitleOctopus;
	SubtitleOctopus.prototype.__class__ = SubtitleOctopus;
	SubtitleOctopus.__cache__ = {};
	Module["SubtitleOctopus"] = SubtitleOctopus;
	SubtitleOctopus.prototype["setLogLevel"] = SubtitleOctopus.prototype.setLogLevel = function (level) {
		var self = this.ptr;
		if (level && typeof level === "object") level = level.ptr;
		_emscripten_bind_SubtitleOctopus_setLogLevel_1(self, level)
	};
	SubtitleOctopus.prototype["setDropAnimations"] = SubtitleOctopus.prototype.setDropAnimations = function (value) {
		var self = this.ptr;
		if (value && typeof value === "object") value = value.ptr;
		_emscripten_bind_SubtitleOctopus_setDropAnimations_1(self, value)
	};
	SubtitleOctopus.prototype["initLibrary"] = SubtitleOctopus.prototype.initLibrary = function (frame_w, frame_h, default_font) {
		var self = this.ptr;
		ensureCache.prepare();
		if (frame_w && typeof frame_w === "object") frame_w = frame_w.ptr;
		if (frame_h && typeof frame_h === "object") frame_h = frame_h.ptr;
		if (default_font && typeof default_font === "object") default_font = default_font.ptr;
		else default_font = ensureString(default_font, false);
		_emscripten_bind_SubtitleOctopus_initLibrary_3(self, frame_w, frame_h, default_font)
	};
	SubtitleOctopus.prototype["createTrack"] = SubtitleOctopus.prototype.createTrack = function (subfile) {
		var self = this.ptr;
		ensureCache.prepare();
		if (subfile && typeof subfile === "object") subfile = subfile.ptr;
		else subfile = ensureString(subfile, false);
		_emscripten_bind_SubtitleOctopus_createTrack_1(self, subfile)
	};
	SubtitleOctopus.prototype["createTrackMem"] = SubtitleOctopus.prototype.createTrackMem = function (buf, bufsize) {
		var self = this.ptr;
		ensureCache.prepare();
		if (buf && typeof buf === "object") buf = buf.ptr;
		else buf = ensureString(buf, false);
		if (bufsize && typeof bufsize === "object") bufsize = bufsize.ptr;
		_emscripten_bind_SubtitleOctopus_createTrackMem_2(self, buf, bufsize)
	};
	SubtitleOctopus.prototype["removeTrack"] = SubtitleOctopus.prototype.removeTrack = function () {
		var self = this.ptr;
		_emscripten_bind_SubtitleOctopus_removeTrack_0(self)
	};
	SubtitleOctopus.prototype["resizeCanvas"] = SubtitleOctopus.prototype.resizeCanvas = function (frame_w, frame_h) {
		var self = this.ptr;
		if (frame_w && typeof frame_w === "object") frame_w = frame_w.ptr;
		if (frame_h && typeof frame_h === "object") frame_h = frame_h.ptr;
		_emscripten_bind_SubtitleOctopus_resizeCanvas_2(self, frame_w, frame_h)
	};
	SubtitleOctopus.prototype["renderImage"] = SubtitleOctopus.prototype.renderImage = function (time, changed) {
		var self = this.ptr;
		if (time && typeof time === "object") time = time.ptr;
		if (changed && typeof changed === "object") changed = changed.ptr;
		return wrapPointer(_emscripten_bind_SubtitleOctopus_renderImage_2(self, time, changed), ASS_Image)
	};
	SubtitleOctopus.prototype["quitLibrary"] = SubtitleOctopus.prototype.quitLibrary = function () {
		var self = this.ptr;
		_emscripten_bind_SubtitleOctopus_quitLibrary_0(self)
	};
	SubtitleOctopus.prototype["reloadLibrary"] = SubtitleOctopus.prototype.reloadLibrary = function () {
		var self = this.ptr;
		_emscripten_bind_SubtitleOctopus_reloadLibrary_0(self)
	};
	SubtitleOctopus.prototype["reloadFonts"] = SubtitleOctopus.prototype.reloadFonts = function () {
		var self = this.ptr;
		_emscripten_bind_SubtitleOctopus_reloadFonts_0(self)
	};
	SubtitleOctopus.prototype["setMargin"] = SubtitleOctopus.prototype.setMargin = function (top, bottom, left, right) {
		var self = this.ptr;
		if (top && typeof top === "object") top = top.ptr;
		if (bottom && typeof bottom === "object") bottom = bottom.ptr;
		if (left && typeof left === "object") left = left.ptr;
		if (right && typeof right === "object") right = right.ptr;
		_emscripten_bind_SubtitleOctopus_setMargin_4(self, top, bottom, left, right)
	};
	SubtitleOctopus.prototype["getEventCount"] = SubtitleOctopus.prototype.getEventCount = function () {
		var self = this.ptr;
		return _emscripten_bind_SubtitleOctopus_getEventCount_0(self)
	};
	SubtitleOctopus.prototype["allocEvent"] = SubtitleOctopus.prototype.allocEvent = function () {
		var self = this.ptr;
		return _emscripten_bind_SubtitleOctopus_allocEvent_0(self)
	};
	SubtitleOctopus.prototype["allocStyle"] = SubtitleOctopus.prototype.allocStyle = function () {
		var self = this.ptr;
		return _emscripten_bind_SubtitleOctopus_allocStyle_0(self)
	};
	SubtitleOctopus.prototype["removeEvent"] = SubtitleOctopus.prototype.removeEvent = function (eid) {
		var self = this.ptr;
		if (eid && typeof eid === "object") eid = eid.ptr;
		_emscripten_bind_SubtitleOctopus_removeEvent_1(self, eid)
	};
	SubtitleOctopus.prototype["getStyleCount"] = SubtitleOctopus.prototype.getStyleCount = function () {
		var self = this.ptr;
		return _emscripten_bind_SubtitleOctopus_getStyleCount_0(self)
	};
	SubtitleOctopus.prototype["getStyleByName"] = SubtitleOctopus.prototype.getStyleByName = function (name) {
		var self = this.ptr;
		ensureCache.prepare();
		if (name && typeof name === "object") name = name.ptr;
		else name = ensureString(name, false);
		return _emscripten_bind_SubtitleOctopus_getStyleByName_1(self, name)
	};
	SubtitleOctopus.prototype["removeStyle"] = SubtitleOctopus.prototype.removeStyle = function (eid) {
		var self = this.ptr;
		if (eid && typeof eid === "object") eid = eid.ptr;
		_emscripten_bind_SubtitleOctopus_removeStyle_1(self, eid)
	};
	SubtitleOctopus.prototype["removeAllEvents"] = SubtitleOctopus.prototype.removeAllEvents = function () {
		var self = this.ptr;
		_emscripten_bind_SubtitleOctopus_removeAllEvents_0(self)
	};
	SubtitleOctopus.prototype["setMemoryLimits"] = SubtitleOctopus.prototype.setMemoryLimits = function (glyph_limit, bitmap_cache_limit) {
		var self = this.ptr;
		if (glyph_limit && typeof glyph_limit === "object") glyph_limit = glyph_limit.ptr;
		if (bitmap_cache_limit && typeof bitmap_cache_limit === "object") bitmap_cache_limit = bitmap_cache_limit.ptr;
		_emscripten_bind_SubtitleOctopus_setMemoryLimits_2(self, glyph_limit, bitmap_cache_limit)
	};
	SubtitleOctopus.prototype["renderBlend"] = SubtitleOctopus.prototype.renderBlend = function (tm, force) {
		var self = this.ptr;
		if (tm && typeof tm === "object") tm = tm.ptr;
		if (force && typeof force === "object") force = force.ptr;
		return wrapPointer(_emscripten_bind_SubtitleOctopus_renderBlend_2(self, tm, force), RenderBlendResult)
	};
	SubtitleOctopus.prototype["get_track"] = SubtitleOctopus.prototype.get_track = function () {
		var self = this.ptr;
		return wrapPointer(_emscripten_bind_SubtitleOctopus_get_track_0(self), ASS_Track)
	};
	SubtitleOctopus.prototype["set_track"] = SubtitleOctopus.prototype.set_track = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_SubtitleOctopus_set_track_1(self, arg0)
	};
	Object.defineProperty(SubtitleOctopus.prototype, "track", {
		get: SubtitleOctopus.prototype.get_track,
		set: SubtitleOctopus.prototype.set_track
	});
	SubtitleOctopus.prototype["get_ass_renderer"] = SubtitleOctopus.prototype.get_ass_renderer = function () {
		var self = this.ptr;
		return wrapPointer(_emscripten_bind_SubtitleOctopus_get_ass_renderer_0(self), ASS_Renderer)
	};
	SubtitleOctopus.prototype["set_ass_renderer"] = SubtitleOctopus.prototype.set_ass_renderer = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_SubtitleOctopus_set_ass_renderer_1(self, arg0)
	};
	Object.defineProperty(SubtitleOctopus.prototype, "ass_renderer", {
		get: SubtitleOctopus.prototype.get_ass_renderer,
		set: SubtitleOctopus.prototype.set_ass_renderer
	});
	SubtitleOctopus.prototype["get_ass_library"] = SubtitleOctopus.prototype.get_ass_library = function () {
		var self = this.ptr;
		return wrapPointer(_emscripten_bind_SubtitleOctopus_get_ass_library_0(self), ASS_Library)
	};
	SubtitleOctopus.prototype["set_ass_library"] = SubtitleOctopus.prototype.set_ass_library = function (arg0) {
		var self = this.ptr;
		if (arg0 && typeof arg0 === "object") arg0 = arg0.ptr;
		_emscripten_bind_SubtitleOctopus_set_ass_library_1(self, arg0)
	};
	Object.defineProperty(SubtitleOctopus.prototype, "ass_library", {
		get: SubtitleOctopus.prototype.get_ass_library,
		set: SubtitleOctopus.prototype.set_ass_library
	});
	SubtitleOctopus.prototype["__destroy__"] = SubtitleOctopus.prototype.__destroy__ = function () {
		var self = this.ptr;
		_emscripten_bind_SubtitleOctopus___destroy___0(self)
	};
	(function () {
		function setupEnums() {
			Module["ASS_HINTING_NONE"] = _emscripten_enum_ASS_Hinting_ASS_HINTING_NONE();
			Module["ASS_HINTING_LIGHT"] = _emscripten_enum_ASS_Hinting_ASS_HINTING_LIGHT();
			Module["ASS_HINTING_NORMAL"] = _emscripten_enum_ASS_Hinting_ASS_HINTING_NORMAL();
			Module["ASS_HINTING_NATIVE"] = _emscripten_enum_ASS_Hinting_ASS_HINTING_NATIVE();
			Module["ASS_SHAPING_SIMPLE"] = _emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_SIMPLE();
			Module["ASS_SHAPING_COMPLEX"] = _emscripten_enum_ASS_ShapingLevel_ASS_SHAPING_COMPLEX();
			Module["ASS_OVERRIDE_DEFAULT"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_DEFAULT();
			Module["ASS_OVERRIDE_BIT_STYLE"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_STYLE();
			Module["ASS_OVERRIDE_BIT_SELECTIVE_FONT_SCALE"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_SELECTIVE_FONT_SCALE();
			Module["ASS_OVERRIDE_BIT_FONT_SIZE"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE();
			Module["ASS_OVERRIDE_BIT_FONT_SIZE_FIELDS"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_SIZE_FIELDS();
			Module["ASS_OVERRIDE_BIT_FONT_NAME"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_FONT_NAME();
			Module["ASS_OVERRIDE_BIT_COLORS"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_COLORS();
			Module["ASS_OVERRIDE_BIT_ATTRIBUTES"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ATTRIBUTES();
			Module["ASS_OVERRIDE_BIT_BORDER"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_BORDER();
			Module["ASS_OVERRIDE_BIT_ALIGNMENT"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_ALIGNMENT();
			Module["ASS_OVERRIDE_BIT_MARGINS"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_MARGINS();
			Module["ASS_OVERRIDE_FULL_STYLE"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_FULL_STYLE();
			Module["ASS_OVERRIDE_BIT_JUSTIFY"] = _emscripten_enum_ASS_OverrideBits_ASS_OVERRIDE_BIT_JUSTIFY()
		}
		if (runtimeInitialized) setupEnums();
		else addOnInit(setupEnums)
	})();
	Module["FS"] = FS;
	self.delay = 0;
	self.lastCurrentTime = 0;
	self.rate = 1;
	self.rafId = null;
	self.nextIsRaf = false;
	self.lastCurrentTimeReceivedAt = Date.now();
	self.targetFps = 24;
	self.libassMemoryLimit = 0;
	self.dropAllAnimations = false;
	self.width = 0;
	self.height = 0;
	self.fontMap_ = {};
	self.fontId = 0;
	self.writeFontToFS = function (font) {
		font = font.trim().toLowerCase();
		if (font.startsWith("@")) {
			font = font.substr(1)
		}
		if (self.fontMap_.hasOwnProperty(font)) return;
		self.fontMap_[font] = true;
		if (!self.availableFonts.hasOwnProperty(font)) return;
		self.loadFontFile("font" + self.fontId++ + "-", self.availableFonts[font])
	};
	self.loadFontFile = function (fontId, path) {
		if (self.lazyFileLoading && path.indexOf("blob:") !== 0) {
			Module["FS"].createLazyFile("/fonts", fontId + path.split("/").pop(), path, true, false)
		} else {
			Module["FS"].createPreloadedFile("/fonts", fontId + path.split("/").pop(), path, true, false)
		}
	};
	self.writeAvailableFontsToFS = function (content) {
		if (!self.availableFonts) return;
		var sections = parseAss(content);
		for (var i = 0; i < sections.length; i++) {
			for (var j = 0; j < sections[i].body.length; j++) {
				if (sections[i].body[j].key === "Style") {
					self.writeFontToFS(sections[i].body[j].value["Fontname"])
				}
			}
		}
		var regex = /\\fn([^\\}]*?)[\\}]/g;
		var matches;
		while (matches = regex.exec(self.subContent)) {
			self.writeFontToFS(matches[1])
		}
	};
	self.getRenderMethod = function () {
		switch (self.renderMode) {
			case "lossy":
				return self.lossyRender;
			case "js-blend":
				return self.render;
			default:
				console.error("Unrecognised renderMode, falling back to default!");
				self.renderMode = "wasm-blend";
			case "wasm-blend":
				return self.blendRender
		}
	};
	self.setTrack = function (content) {
		self.writeAvailableFontsToFS(content);
		Module["FS"].writeFile("/sub.ass", content);
		self.octObj.createTrack("/sub.ass");
		self.ass_track = self.octObj.track;
		self.ass_renderer = self.octObj.ass_renderer;
		self.ass_library = self.octObj.ass_library;
		self.getRenderMethod()()
	};
	self.freeTrack = function () {
		self.octObj.removeTrack();
		self.getRenderMethod()()
	};
	self.setTrackByUrl = function (url) {
		var content = "";
		content = read_(url);
		self.setTrack(content)
	};
	self.resize = function (width, height) {
		self.width = width;
		self.height = height;
		self.octObj.resizeCanvas(width, height)
	};
	self.getCurrentTime = function () {
		var diff = (Date.now() - self.lastCurrentTimeReceivedAt) / 1e3;
		if (self._isPaused) {
			return self.lastCurrentTime
		} else {
			if (diff > 5) {
				console.error("Didn't received currentTime > 5 seconds. Assuming video was paused.");
				self.setIsPaused(true)
			}
			return self.lastCurrentTime + diff * self.rate
		}
	};
	self.setCurrentTime = function (currentTime) {
		self.lastCurrentTime = currentTime;
		self.lastCurrentTimeReceivedAt = Date.now();
		if (!self.rafId) {
			if (self.nextIsRaf) {
				self.rafId = self.requestAnimationFrame(self.getRenderMethod())
			} else {
				self.getRenderMethod()();
				setTimeout(function () {
					self.nextIsRaf = false
				}, 20)
			}
		}
	};
	self._isPaused = true;
	self.getIsPaused = function () {
		return self._isPaused
	};
	self.setIsPaused = function (isPaused) {
		if (isPaused != self._isPaused) {
			self._isPaused = isPaused;
			if (isPaused) {
				if (self.rafId) {
					clearTimeout(self.rafId);
					self.rafId = null
				}
			} else {
				self.lastCurrentTimeReceivedAt = Date.now();
				self.rafId = self.requestAnimationFrame(self.getRenderMethod())
			}
		}
	};
	self.render = function (force) {
		self.rafId = 0;
		self.renderPending = false;
		var startTime = performance.now();
		var renderResult = self.octObj.renderImage(self.getCurrentTime() + self.delay, self.changed);
		var changed = Module.getValue(self.changed, "i32");
		if (changed != 0 || force) {
			var result = self.buildResult(renderResult);
			var spentTime = performance.now() - startTime;
			postMessage({
				target: "canvas",
				op: "renderCanvas",
				time: Date.now(),
				spentTime: spentTime,
				canvases: result[0]
			}, result[1])
		}
		if (!self._isPaused) {
			self.rafId = self.requestAnimationFrame(self.render)
		}
	};
	self.blendRender = function (force) {
		self.rafId = 0;
		self.renderPending = false;
		var startTime = performance.now();
		var renderResult = self.octObj.renderBlend(self.getCurrentTime() + self.delay, force);
		if (renderResult.changed != 0 || force) {
			var canvases = [];
			var buffers = [];
			if (renderResult.image) {
				var result = new Uint8Array(HEAPU8.subarray(renderResult.image, renderResult.image + renderResult.dest_width * renderResult.dest_height * 4));
				canvases = [{
					w: renderResult.dest_width,
					h: renderResult.dest_height,
					x: renderResult.dest_x,
					y: renderResult.dest_y,
					buffer: result.buffer
				}];
				buffers = [result.buffer]
			}
			postMessage({
				target: "canvas",
				op: "renderCanvas",
				time: Date.now(),
				spentTime: performance.now() - startTime,
				blendTime: renderResult.blend_time,
				canvases: canvases
			}, buffers)
		}
		if (!self._isPaused) {
			self.rafId = self.requestAnimationFrame(self.blendRender)
		}
	};
	self.lossyRender = function (force) {
		self.rafId = 0;
		self.renderPending = false;
		var startTime = performance.now();
		var renderResult = self.octObj.renderImage(self.getCurrentTime() + self.delay, self.changed);
		var changed = Module.getValue(self.changed, "i32");
		if (changed != 0 || force) {
			var result = self.buildResult(renderResult);
			var newTime = performance.now();
			var libassTime = newTime - startTime;
			var promises = [];
			for (var i = 0; i < result[0].length; i++) {
				var image = result[0][i];
				var imageBuffer = new Uint8ClampedArray(image.buffer);
				var imageData = new ImageData(imageBuffer, image.w, image.h);
				promises[i] = createImageBitmap(imageData, 0, 0, image.w, image.h)
			}
			Promise.all(promises).then(function (imgs) {
				var decodeTime = performance.now() - newTime;
				var bitmaps = [];
				for (var i = 0; i < imgs.length; i++) {
					var image = result[0][i];
					bitmaps[i] = {
						x: image.x,
						y: image.y,
						bitmap: imgs[i]
					}
				}
				postMessage({
					target: "canvas",
					op: "renderFastCanvas",
					time: Date.now(),
					libassTime: libassTime,
					decodeTime: decodeTime,
					bitmaps: bitmaps
				}, imgs)
			})
		}
		if (!self._isPaused) {
			self.rafId = self.requestAnimationFrame(self.lossyRender)
		}
	};
	self.buildResult = function (ptr) {
		var items = [];
		var transferable = [];
		var item;
		while (ptr.ptr != 0) {
			item = self.buildResultItem(ptr);
			if (item !== null) {
				items.push(item);
				transferable.push(item.buffer)
			}
			ptr = ptr.next
		}
		return [items, transferable]
	};
	self.buildResultItem = function (ptr) {
		var bitmap = ptr.bitmap,
			stride = ptr.stride,
			w = ptr.w,
			h = ptr.h,
			color = ptr.color;
		if (w == 0 || h == 0) {
			return null
		}
		var r = color >> 24 & 255,
			g = color >> 16 & 255,
			b = color >> 8 & 255,
			a = 255 - (color & 255);
		var result = new Uint8ClampedArray(4 * w * h);
		var bitmapPosition = 0;
		var resultPosition = 0;
		for (var y = 0; y < h; ++y) {
			for (var x = 0; x < w; ++x) {
				var k = Module.HEAPU8[bitmap + bitmapPosition + x] * a / 255;
				result[resultPosition] = r;
				result[resultPosition + 1] = g;
				result[resultPosition + 2] = b;
				result[resultPosition + 3] = k;
				resultPosition += 4
			}
			bitmapPosition += stride
		}
		x = ptr.dst_x;
		y = ptr.dst_y;
		return {
			w: w,
			h: h,
			x: x,
			y: y,
			buffer: result.buffer
		}
	};
	if (typeof SDL !== "undefined") {
		SDL.defaults.copyOnLock = false;
		SDL.defaults.discardOnLock = false;
		SDL.defaults.opaqueFrontBuffer = false
	}

	function parseAss(content) {
		var m, format, lastPart, parts, key, value, tmp, i, j, body;
		var sections = [];
		var lines = content.split(/[\r\n]+/g);
		for (i = 0; i < lines.length; i++) {
			m = lines[i].match(/^\[(.*)\]$/);
			if (m) {
				format = null;
				sections.push({
					name: m[1],
					body: []
				})
			} else {
				if (/^\s*$/.test(lines[i])) continue;
				if (sections.length === 0) continue;
				body = sections[sections.length - 1].body;
				if (lines[i][0] === ";") {
					body.push({
						type: "comment",
						value: lines[i].substring(1)
					})
				} else {
					parts = lines[i].split(":");
					key = parts[0];
					value = parts.slice(1).join(":").trim();
					if (format || key === "Format") {
						value = value.split(",");
						if (format && value.length > format.length) {
							lastPart = value.slice(format.length - 1).join(",");
							value = value.slice(0, format.length - 1);
							value.push(lastPart)
						}
						value = value.map(function (s) {
							return s.trim()
						});
						if (format) {
							tmp = {};
							for (j = 0; j < value.length; j++) {
								tmp[format[j]] = value[j]
							}
							value = tmp
						}
					}
					if (key === "Format") {
						format = value
					}
					body.push({
						key: key,
						value: value
					})
				}
			}
		}
		return sections
	}
	self.requestAnimationFrame = function () {
		var nextRAF = 0;
		return function (func) {
			var now = Date.now();
			if (nextRAF === 0) {
				nextRAF = now + 1e3 / self.targetFps
			} else {
				while (now + 2 >= nextRAF) {
					nextRAF += 1e3 / self.targetFps
				}
			}
			var delay = Math.max(nextRAF - now, 0);
			return setTimeout(func, delay)
		}
	}();
	var screen = {
		width: 0,
		height: 0
	};
	Module.print = function Module_print(x) {
		postMessage({
			target: "stdout",
			content: x
		})
	};
	Module.printErr = function Module_printErr(x) {
		postMessage({
			target: "stderr",
			content: x
		})
	};
	var frameId = 0;
	var clientFrameId = 0;
	var commandBuffer = [];
	var postMainLoop = Module["postMainLoop"];
	Module["postMainLoop"] = function () {
		if (postMainLoop) postMainLoop();
		postMessage({
			target: "tick",
			id: frameId++
		});
		commandBuffer = []
	};
	addRunDependency("worker-init");
	var messageBuffer = null;
	var messageResenderTimeout = null;

	function messageResender() {
		if (calledMain) {
			assert(messageBuffer && messageBuffer.length > 0);
			messageResenderTimeout = null;
			messageBuffer.forEach(function (message) {
				onmessage(message)
			});
			messageBuffer = null
		} else {
			messageResenderTimeout = setTimeout(messageResender, 50)
		}
	}

	function _applyKeys(input, output) {
		var vargs = Object.keys(input);
		for (var i = 0; i < vargs.length; i++) {
			output[vargs[i]] = input[vargs[i]]
		}
	}

	function onMessageFromMainEmscriptenThread(message) {
		if (!calledMain && !message.data.preMain) {
			if (!messageBuffer) {
				messageBuffer = [];
				messageResenderTimeout = setTimeout(messageResender, 50)
			}
			messageBuffer.push(message);
			return
		}
		if (calledMain && messageResenderTimeout) {
			clearTimeout(messageResenderTimeout);
			messageResender()
		}
		switch (message.data.target) {
			case "window": {
				self.fireEvent(message.data.event);
				break
			}
			case "canvas": {
				if (message.data.event) {
					Module.canvas.fireEvent(message.data.event)
				} else if (message.data.width) {
					if (Module.canvas && message.data.boundingClientRect) {
						Module.canvas.boundingClientRect = message.data.boundingClientRect
					}
					self.resize(message.data.width, message.data.height);
					self.getRenderMethod()()
				} else throw "ey?";
				break
			}
			case "video": {
				if (message.data.currentTime !== undefined) {
					self.setCurrentTime(message.data.currentTime)
				}
				if (message.data.isPaused !== undefined) {
					self.setIsPaused(message.data.isPaused)
				}
				if (message.data.rate) {
					self.rate = message.data.rate
				}
				break
			}
			case "tock": {
				clientFrameId = message.data.id;
				break
			}
			case "worker-init": {
				screen.width = self.width = message.data.width;
				screen.height = self.height = message.data.height;
				self.subUrl = message.data.subUrl;
				self.subContent = message.data.subContent;
				self.fontFiles = message.data.fonts;
				self.renderMode = message.data.renderMode;
				if (self.renderMode == "lossy" && typeof createImageBitmap === "undefined") {
					self.renderMode = "wasm-blend";
					console.error("'createImageBitmap' needed for 'lossy' unsupported. Falling back to default!")
				}
				self.availableFonts = message.data.availableFonts;
				self.fallbackFont = message.data.fallbackFont;
				self.lazyFileLoading = message.data.lazyFileLoading;
				self.debug = message.data.debug;
				if (!hasNativeConsole && self.debug) {
					console = makeCustomConsole();
					console.log("overridden console")
				}
				if (Module.canvas) {
					Module.canvas.width_ = message.data.width;
					Module.canvas.height_ = message.data.height;
					if (message.data.boundingClientRect) {
						Module.canvas.boundingClientRect = message.data.boundingClientRect
					}
				}
				self.targetFps = message.data.targetFps || self.targetFps;
				self.libassMemoryLimit = message.data.libassMemoryLimit || self.libassMemoryLimit;
				self.libassGlyphLimit = message.data.libassGlyphLimit || 0;
				self.dropAllAnimations = !!message.data.dropAllAnimations || self.dropAllAnimations;
				removeRunDependency("worker-init");
				postMessage({
					target: "ready"
				});
				break
			}
			case "destroy":
				self.octObj.quitLibrary();
				break;
			case "free-track":
				self.freeTrack();
				break;
			case "set-track":
				self.setTrack(message.data.content);
				break;
			case "set-track-by-url":
				self.setTrackByUrl(message.data.url);
				break;
			case "create-event":
				var event = message.data.event;
				var i = self.octObj.allocEvent();
				var evnt_ptr = self.octObj.track.get_events(i);
				_applyKeys(event, evnt_ptr);
				break;
			case "get-events":
				var events = [];
				for (var i = 0; i < self.octObj.getEventCount(); i++) {
					var evnt_ptr = self.octObj.track.get_events(i);
					var event = {
						_index: i,
						Start: evnt_ptr.get_Start(),
						Duration: evnt_ptr.get_Duration(),
						ReadOrder: evnt_ptr.get_ReadOrder(),
						Layer: evnt_ptr.get_Layer(),
						Style: evnt_ptr.get_Style(),
						Name: evnt_ptr.get_Name(),
						MarginL: evnt_ptr.get_MarginL(),
						MarginR: evnt_ptr.get_MarginR(),
						MarginV: evnt_ptr.get_MarginV(),
						Effect: evnt_ptr.get_Effect(),
						Text: evnt_ptr.get_Text()
					};
					events.push(event)
				}
				postMessage({
					target: "get-events",
					time: Date.now(),
					events: events
				});
				break;
			case "set-event":
				var event = message.data.event;
				var i = message.data.index;
				var evnt_ptr = self.octObj.track.get_events(i);
				_applyKeys(event, evnt_ptr);
				break;
			case "remove-event":
				var i = message.data.index;
				self.octObj.removeEvent(i);
				break;
			case "create-style":
				var style = message.data.style;
				var i = self.octObj.allocStyle();
				var styl_ptr = self.octObj.track.get_styles(i);
				_applyKeys(style, styl_ptr);
				break;
			case "get-styles":
				var styles = [];
				for (var i = 0; i < self.octObj.getStyleCount(); i++) {
					var styl_ptr = self.octObj.track.get_styles(i);
					var style = {
						_index: i,
						Name: styl_ptr.get_Name(),
						FontName: styl_ptr.get_FontName(),
						FontSize: styl_ptr.get_FontSize(),
						PrimaryColour: styl_ptr.get_PrimaryColour(),
						SecondaryColour: styl_ptr.get_SecondaryColour(),
						OutlineColour: styl_ptr.get_OutlineColour(),
						BackColour: styl_ptr.get_BackColour(),
						Bold: styl_ptr.get_Bold(),
						Italic: styl_ptr.get_Italic(),
						Underline: styl_ptr.get_Underline(),
						StrikeOut: styl_ptr.get_StrikeOut(),
						ScaleX: styl_ptr.get_ScaleX(),
						ScaleY: styl_ptr.get_ScaleY(),
						Spacing: styl_ptr.get_Spacing(),
						Angle: styl_ptr.get_Angle(),
						BorderStyle: styl_ptr.get_BorderStyle(),
						Outline: styl_ptr.get_Outline(),
						Shadow: styl_ptr.get_Shadow(),
						Alignment: styl_ptr.get_Alignment(),
						MarginL: styl_ptr.get_MarginL(),
						MarginR: styl_ptr.get_MarginR(),
						MarginV: styl_ptr.get_MarginV(),
						Encoding: styl_ptr.get_Encoding(),
						treat_fontname_as_pattern: styl_ptr.get_treat_fontname_as_pattern(),
						Blur: styl_ptr.get_Blur(),
						Justify: styl_ptr.get_Justify()
					};
					styles.push(style)
				}
				postMessage({
					target: "get-styles",
					time: Date.now(),
					styles: styles
				});
				break;
			case "set-style":
				var style = message.data.style;
				var i = message.data.index;
				var styl_ptr = self.octObj.track.get_styles(i);
				_applyKeys(style, styl_ptr);
				break;
			case "remove-style":
				var i = message.data.index;
				self.octObj.removeStyle(i);
				break;
			case "runBenchmark": {
				self.runBenchmark();
				break
			}
			case "custom": {
				if (Module["onCustomMessage"]) {
					Module["onCustomMessage"](message)
				} else {
					throw "Custom message received but worker Module.onCustomMessage not implemented."
				}
				break
			}
			case "setimmediate": {
				if (Module["setImmediates"]) Module["setImmediates"].shift()();
				break
			}
			default:
				throw "wha? " + message.data.target
		}
	}
	onmessage = onMessageFromMainEmscriptenThread;
	self.runBenchmark = function (seconds, pos, async) {
		var totalTime = 0;
		var i = 0;
		pos = pos || 0;
		seconds = seconds || 60;
		var count = seconds * self.targetFps;
		var start = performance.now();
		var longestFrame = 0;
		var run = function () {
			var t0 = performance.now();
			pos += 1 / self.targetFps;
			self.setCurrentTime(pos);
			var t1 = performance.now();
			var diff = t1 - t0;
			totalTime += diff;
			if (diff > longestFrame) {
				longestFrame = diff
			}
			if (i < count) {
				i++;
				if (async) {
					self.requestAnimationFrame(run);
					return false
				} else {
					return true
				}
			} else {
				console.log("Performance fps: " + Math.round(1e3 / (totalTime / count)) + "");
				console.log("Real fps: " + Math.round(1e3 / ((t1 - start) / count)) + "");
				console.log("Total time: " + totalTime);
				console.log("Longest frame: " + Math.ceil(longestFrame) + "ms (" + Math.floor(1e3 / longestFrame) + " fps)");
				return false
			}
		};
		while (true) {
			if (!run()) {
				break
			}
		}
	};
}
