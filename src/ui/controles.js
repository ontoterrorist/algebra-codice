/* Controles de respuesta, uno por tipo de entrada. Cada uno devuelve {el, leer(), marcar(res), bloquear()}. */
(function (AC) {
  const ui = AC.ui, h = ui.h, L = AC.logic;
  const VF = b => (b === null ? '·' : b ? 'V' : 'F');
  const sr = t => h('span', { class: 'sr' }, t);
  const marca = ok => h('span', { class: 'marca ' + (ok ? 'ok' : 'mal') }, h('span', { 'aria-hidden': 'true' }, ok ? '✓' : '✗'), ' ', ok ? 'bien' : 'revisa');
  function marcar(el, ok) { el.classList.remove('ok', 'mal'); el.classList.add(ok ? 'ok' : 'mal'); el.appendChild(marca(ok)); if (ok) AC.fx.destello(el); }
  const opcionNodo = o => o.ref ? document.createTextNode(AC.catalogo.nombreRef(o.ref)) : o.nombre ? document.createTextNode(o.nombre) : o.tex ? ui.tex(o.tex) : ui.mate(o.txt || '');
  let uid = 0;

  /* ---------- listas ordenables con arrastre (Pointer Events), botones y teclado ---------- */
  function listaOrdenable(inst, api) {
    const e = inst.entrada, conJust = e.tipo === 'construccion';
    const est = e.items.map(i => ({ id: i.id, texto: i.texto, usada: true, just: null }));
    const ul = h('ol', { class: 'ordenable', role: 'list' });
    let tomada = null;
    const lineas = est;
    function mover(id, delta) {
      const i = lineas.findIndex(x => x.id === id), j = i + delta;
      if (j < 0 || j >= lineas.length) return;
      const [x] = lineas.splice(i, 1); lineas.splice(j, 0, x); pintar(id);
      ui.anunciar('Línea movida a la posición ' + (j + 1) + ' de ' + lineas.length);
    }
    function pintar(foco) {
      ui.vaciar(ul);
      lineas.forEach((l, i) => {
        const sel = conJust ? h('select', { 'aria-label': 'Justificación de la línea ' + (i + 1), disabled: !l.usada, onchange: ev => { l.just = ev.target.value || null; api.cambio(); } },
          h('option', { value: '' }, '— justificación —'), ...(e.opciones[l.id] || Object.values(e.opciones)[0]).map(o => h('option', { value: o.id, selected: l.just === o.id }, o.nombre))) : null;
        // las líneas distractoras no tienen opciones propias: se ofrece el conjunto general de la primera línea
        const li = h('li', { class: 'fila-orden' + (l.usada ? '' : ' descartada') + (tomada === l.id ? ' tomada' : ''), dataset: { id: l.id } },
          h('button', { type: 'button', class: 'asa', 'aria-label': 'Mover la línea: espacio para tomarla, flechas para moverla', 'aria-pressed': String(tomada === l.id),
            onkeydown: ev => {
              if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); tomada = tomada === l.id ? null : l.id; pintar(l.id); }
              else if (ev.key === 'Escape') { tomada = null; pintar(l.id); }
              else if (tomada === l.id && (ev.key === 'ArrowUp' || ev.key === 'ArrowDown')) { ev.preventDefault(); mover(l.id, ev.key === 'ArrowUp' ? -1 : 1); }
            },
            onpointerdown: ev => arrastrar(ev, li, l) }, '⠿'),
          h('div', { class: 'texto-linea' }, ui.mate(l.texto), sel),
          h('div', { class: 'acciones-linea' },
            h('button', { type: 'button', class: 'mini', 'aria-label': 'Subir', disabled: i === 0, onclick: () => mover(l.id, -1) }, '↑'),
            h('button', { type: 'button', class: 'mini', 'aria-label': 'Bajar', disabled: i === lineas.length - 1, onclick: () => mover(l.id, 1) }, '↓'),
            h('button', { type: 'button', class: 'mini', 'aria-pressed': String(!l.usada), onclick: () => { l.usada = !l.usada; pintar(l.id); api.cambio(); } }, l.usada ? 'Descartar' : 'Usar')));
        ul.appendChild(li);
        if (foco === l.id) { const b = li.querySelector('.asa'); if (b && document.activeElement !== b && !ul.dataset.arrastrando) setTimeout(() => b.focus(), 0); }
      });
    }
    function arrastrar(ev, li, l) {
      if (ev.button !== undefined && ev.button !== 0) return;
      ev.preventDefault();
      ul.dataset.arrastrando = '1'; li.classList.add('arrastrando');
      const asa = ev.currentTarget; try { asa.setPointerCapture(ev.pointerId); } catch (x) { /* sin captura */ }
      const mov = m => {
        const filas = [...ul.children].filter(x => x !== li);
        const destino = filas.find(f => { const r = f.getBoundingClientRect(); return m.clientY < r.top + r.height / 2; });
        const i = lineas.findIndex(x => x.id === l.id); const [x] = lineas.splice(i, 1);
        const j = destino ? lineas.findIndex(y => y.id === destino.dataset.id) : lineas.length;
        lineas.splice(j, 0, x);
        ul.insertBefore(li, destino || null);
      };
      const fin = () => { asa.removeEventListener('pointermove', mov); asa.removeEventListener('pointerup', fin); asa.removeEventListener('pointercancel', fin); delete ul.dataset.arrastrando; pintar(l.id); };
      asa.addEventListener('pointermove', mov); asa.addEventListener('pointerup', fin); asa.addEventListener('pointercancel', fin);
    }
    pintar();
    const ayuda = h('p', { class: 'ayuda' }, conJust ? 'Arrastra con ⠿ (o usa las flechas), descarta las líneas que sobran y elige la justificación de cada una.' : 'Arrastra con ⠿ (o usa las flechas) y descarta con «Descartar» las líneas que no pertenecen a la demostración.',
      e.numLineas ? ' La demostración tiene ' + e.numLineas + ' líneas.' : '');
    return {
      el: h('div', null, ayuda, ul),
      leer: () => ({ usadas: lineas.filter(l => l.usada).map(l => l.id), just: Object.fromEntries(lineas.filter(l => l.usada && l.just).map(l => [l.id, l.just])) }),
      marcar(res) {
        const f = res.fallos || {};
        [...ul.children].forEach(li => {
          const id = li.dataset.id, l = lineas.find(x => x.id === id);
          const mal = (f.distractores || []).includes(id) || (f.violaciones || []).some(v => v.linea === id && !v.ausente) || (f.justMalas || []).includes(id) || (!l.usada && !id.startsWith('X'));
          const bien = l.usada ? !mal : id.startsWith('X');
          li.appendChild(marca(bien)); li.classList.add(bien ? 'ok' : 'mal');
        });
      },
      bloquear() { ul.querySelectorAll('button,select').forEach(b => { b.disabled = true; }); },
    };
  }

  /* ---------- fábrica ---------- */
  ui.crearControl = function (inst, api) {
    const e = inst.entrada;
    switch (e.tipo) {
      case 'tabla': {
        const vals = e.filas.map(() => null);
        const botones = e.filas.map((fila, i) => h('button', { type: 'button', class: 'celda-vf', 'aria-label': 'Fila ' + (i + 1) + ', ' + e.vars.map((v, k) => v + ' ' + (fila[k] ? 'V' : 'F')).join(', ') + ': valor de la fórmula', 'aria-live': 'polite',
          onclick: ev => { vals[i] = vals[i] === true ? false : true; ev.currentTarget.textContent = VF(vals[i]); ev.currentTarget.dataset.v = String(vals[i]); AC.sonido.tocar('click'); api.cambio(); } }, '·'));
        const tabla = h('table', { class: 'tabla-verdad' },
          h('caption', { class: 'sr' }, 'Tabla de verdad de la fórmula'),
          h('thead', null, h('tr', null, e.vars.map(v => h('th', { scope: 'col' }, ui.tex(v))), h('th', { scope: 'col' }, ui.tex(e.formulaTex)), h('th', { scope: 'col', class: 'sr' }, 'Revisión'))),
          h('tbody', null, e.filas.map((fila, i) => h('tr', { dataset: { fila: i } }, fila.map(b => h('td', null, VF(b))), h('td', null, botones[i]), h('td', { class: 'revision' })))));
        return { el: h('div', { class: 'tabla-envoltura' }, tabla), leer: () => vals.slice(),
          marcar(res) { (res.detalle || []).forEach((ok, i) => { const td = tabla.querySelectorAll('tbody tr')[i].querySelector('.revision'); td.appendChild(marca(ok)); botones[i].classList.add(ok ? 'ok' : 'mal'); }); },
          bloquear() { botones.forEach(b => { b.disabled = true; }); } };
      }
      case 'entero': case 'racional': {
        const c = ui.campoMate({ modo: 'num', etiqueta: 'Tu respuesta', onCambio: api.cambio });
        return { el: c.el, leer: c.valor, marcar() {}, bloquear: c.bloquear, foco: () => c.input.focus() };
      }
      case 'logica': {
        const c = ui.campoMate({ modo: 'logica', vars: e.vars, etiqueta: 'Tu fórmula', onCambio: api.cambio });
        return { el: c.el, leer: c.valor, marcar() {}, bloquear: c.bloquear, foco: () => c.input.focus() };
      }
      case 'expr': {
        const c = ui.campoMate({ modo: 'expr', vars: e.vars, etiqueta: 'Tu expresión', onCambio: api.cambio });
        return { el: c.el, leer: c.valor, marcar() {}, bloquear: c.bloquear, foco: () => c.input.focus() };
      }
      case 'complejo': {
        const c = ui.campoMate({ modo: 'expr', vars: ['i'], etiqueta: 'Tu número complejo', onCambio: api.cambio });
        return { el: c.el, leer: c.valor, marcar() {}, bloquear: c.bloquear, foco: () => c.input.focus() };
      }
      case 'tupla': {
        const cs = e.campos.map((nom, i) => ui.campoMate({ modo: 'num', etiqueta: nom, onCambio: api.cambio }));
        const el = h('div', { class: 'tupla' }, e.campos.map((nom, i) => h('div', { class: 'campo-tupla' }, h('label', { class: 'etiqueta' }, ui.mate(nom)), cs[i].el)));
        return { el, leer: () => cs.map(c => c.valor()), marcar(res) { (res.detalle || []).forEach((ok, i) => { cs[i].input.classList.add(ok ? 'ok' : 'mal'); cs[i].el.appendChild(marca(ok)); }); }, bloquear() { cs.forEach(c => c.bloquear()); }, foco: () => cs[0].input.focus() };
      }
      case 'conjunto': {
        const c = ui.campoMate({ modo: 'conjunto', etiqueta: 'Tu conjunto', onCambio: api.cambio });
        return { el: c.el, leer: c.valor, marcar() {}, bloquear: c.bloquear, foco: () => c.input.focus() };
      }
      case 'eleccion': case 'multiple': {
        const multi = e.tipo === 'multiple', name = 'op' + (++uid);
        const sel = new Set();
        const items = e.opciones.map((o, i) => {
          const inp = h('input', { type: multi ? 'checkbox' : 'radio', name, id: name + '_' + i, onchange: () => { if (multi) { inp.checked ? sel.add(i) : sel.delete(i); } else { sel.clear(); sel.add(i); } AC.sonido.tocar('click'); api.cambio(); } });
          return h('label', { class: 'opcion', for: name + '_' + i }, inp, h('span', { class: 'texto-opcion' }, ui.mate(o)));
        });
        return { el: h('div', { class: 'opciones', role: multi ? 'group' : 'radiogroup', 'aria-label': multi ? 'Marca todas las que correspondan' : 'Elige una opción' }, items),
          leer: () => multi ? [...sel] : (sel.size ? [...sel][0] : null),
          marcar(res) { if (multi && res.detalle) res.detalle.forEach((ok, i) => items[i].appendChild(marca(ok))); else if (!multi) { const i = [...sel][0]; if (i !== undefined) { items[i].appendChild(marca(!!res.ok)); items[i].classList.add(res.ok ? 'ok' : 'mal'); } } },
          bloquear() { items.forEach(l => { l.querySelector('input').disabled = true; }); } };
      }
      case 'procedimiento': {
        const leyes = e.leyes.map(l => l.id);
        const pasos = []; let f = L.parse(e.inicio);
        const cont = h('div', { class: 'procedimiento' });
        const actual = h('div', { class: 'estado-actual', 'aria-live': 'polite' });
        const lista = h('ul', { class: 'opciones-paso' });
        const hist = h('ol', { class: 'historial' });
        function pintar() {
          ui.vaciar(actual); actual.appendChild(h('span', null, 'Fórmula actual: ')); actual.appendChild(ui.tex(L.tex(f)));
          if (L.esFNN(f)) actual.appendChild(h('span', { class: 'lista' }, ' — ya cumple la forma pedida'));
          ui.vaciar(lista);
          L.reescrituras(f, leyes).forEach(r => lista.appendChild(h('li', null, h('button', { type: 'button', class: 'paso', onclick: () => { pasos.push({ ley: r.ley, ruta: r.ruta }); const g = L.aplicar(f, r.ruta, r.ley); hist.appendChild(h('li', null, h('span', { class: 'ley' }, L.LEYES[r.ley] + ': '), ui.tex(L.tex(L.parse(r.antes))), ' → ', ui.tex(L.tex(L.parse(r.despues))))); f = g; AC.sonido.tocar('destello'); pintar(); api.cambio(); } },
            h('span', { class: 'ley' }, L.LEYES[r.ley]), ' ', ui.tex(L.tex(L.parse(r.antes))), ' → ', ui.tex(L.tex(L.parse(r.despues)))))));
          if (!lista.children.length) lista.appendChild(h('li', { class: 'ayuda' }, 'No hay más reescrituras posibles.'));
        }
        const deshacer = h('button', { type: 'button', class: 'secundario', onclick: () => { if (!pasos.length) return; pasos.pop(); hist.lastChild.remove(); f = L.parse(e.inicio); pasos.forEach(p => { f = L.aplicar(f, p.ruta, p.ley); }); pintar(); api.cambio(); } }, 'Deshacer el último paso');
        cont.append(actual, h('p', { class: 'ayuda' }, 'Elige una reescritura (la ley y el lugar donde se aplica):'), lista, h('h4', null, 'Tus pasos'), hist, deshacer);
        pintar();
        return { el: cont, leer: () => pasos.slice(), marcar() {}, bloquear() { cont.querySelectorAll('button').forEach(b => { b.disabled = true; }); } };
      }
      case 'asignacion': {
        const env = {}; e.vars.forEach(v => { env[v] = false; });
        const bs = e.vars.map(v => h('button', { type: 'button', class: 'celda-vf grande', 'aria-pressed': 'false', 'aria-label': 'Valor de ' + v, onclick: ev => { env[v] = !env[v]; ev.currentTarget.textContent = VF(env[v]); ev.currentTarget.setAttribute('aria-pressed', String(env[v])); AC.sonido.tocar('click'); api.cambio(); } }, 'F'));
        return { el: h('div', { class: 'asignacion' }, e.vars.map((v, i) => h('label', { class: 'var-valor' }, ui.tex(v), ' = ', bs[i]))), leer: () => Object.assign({}, env), marcar() {}, bloquear() { bs.forEach(b => { b.disabled = true; }); } };
      }
      case 'vf': {
        const st = { valor: null, just: null }, n1 = 'v' + (++uid), n2 = 'j' + uid;
        const vfb = [true, false].map(v => h('label', { class: 'opcion' }, h('input', { type: 'radio', name: n1, onchange: () => { st.valor = v; api.cambio(); } }), h('span', { class: 'texto-opcion' }, v ? 'Verdadera' : 'Falsa')));
        const jb = e.justificaciones.map((t, i) => h('label', { class: 'opcion' }, h('input', { type: 'radio', name: n2, onchange: () => { st.just = i; api.cambio(); } }), h('span', { class: 'texto-opcion' }, ui.mate(t))));
        return { el: h('div', null, h('p', { class: 'etiqueta' }, '¿Es verdadera o falsa?'), h('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Verdadera o falsa' }, vfb), h('p', { class: 'etiqueta' }, 'Justificación'), h('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Justificación' }, jb)),
          leer: () => Object.assign({}, st), marcar() {}, bloquear() { [...vfb, ...jb].forEach(l => { l.querySelector('input').disabled = true; }); } };
      }
      case 'matriz': {
        const filas = e.filas, cols = e.cols, val = Array.from({ length: filas }, () => Array(cols).fill(''));
        const inputs = [];
        const tabla = h('table', { class: 'matriz-grilla' }, h('tbody', null, val.map((fila, i) => h('tr', null, fila.map((_, j) => { const inp = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'Fila ' + (i + 1) + ', columna ' + (j + 1), onchange: () => {}, oninput: ev => { val[i][j] = ev.target.value; api.cambio(); } }); inputs.push(inp); return h('td', null, inp); })))));
        return { el: tabla, leer: () => val.map(r => r.slice()), marcar(res) { (res.detalle || []).forEach((fila, i) => fila.forEach((ok, j) => inputs[i * cols + j].classList.add(ok ? 'ok' : 'mal'))); }, bloquear() { inputs.forEach(i => { i.disabled = true; }); } };
      }
      case 'ordenable': case 'construccion': return listaOrdenable(inst, api);
      case 'justificar': {
        const st = {};
        const sels = e.lineas.map((l, i) => {
          const s = h('select', { 'aria-label': 'Justificación de la línea ' + (i + 1), onchange: ev => { st[l.id] = ev.target.value || null; api.cambio(); } }, h('option', { value: '' }, '— elige —'), l.opciones.map(o => h('option', { value: o.id }, o.nombre)));
          return s;
        });
        const lista = h('ol', { class: 'lineas' }, e.lineas.map((l, i) => h('li', { class: 'linea-just' }, h('div', { class: 'texto-linea' }, ui.mate(l.texto)), h('div', { class: 'just-sel' }, h('span', { class: 'etq' }, 'Justificación: '), sels[i]))));
        return { el: lista, leer: () => ({ just: Object.assign({}, st) }),
          marcar(res) { e.lineas.forEach((l, i) => { const ok = res.detalle ? res.detalle[l.id] : true; lista.children[i].appendChild(marca(ok)); lista.children[i].classList.add(ok ? 'ok' : 'mal'); }); },
          bloquear() { sels.forEach(s => { s.disabled = true; }); } };
      }
      case 'huecos': {
        const sel = {}; const chips = {}, paneles = {};
        function contenidoChip(g) { const o = g.opciones[sel[g.id]]; return o ? opcionNodo(o) : document.createTextNode('elige…'); }
        function chip(g, linea) {
          const b = h('button', { type: 'button', class: 'chip-hueco', 'aria-haspopup': 'true', 'aria-expanded': 'false', 'aria-label': 'Hueco por completar', onclick: () => {
            const p = paneles[g.id], abierto = !p.hidden; Object.values(paneles).forEach(x => { x.hidden = true; });
            Object.values(chips).forEach(x => x.setAttribute('aria-expanded', 'false')); p.hidden = abierto; b.setAttribute('aria-expanded', String(!abierto));
          } }, contenidoChip(g));
          chips[g.id] = b;
          paneles[g.id] = h('div', { class: 'panel-hueco', role: 'group', 'aria-label': 'Opciones del hueco', hidden: true }, g.opciones.map((o, i) => h('button', { type: 'button', class: 'opcion-hueco', onclick: () => { sel[g.id] = i; ui.vaciar(b); b.appendChild(contenidoChip(g)); paneles[g.id].hidden = true; b.setAttribute('aria-expanded', 'false'); b.classList.add('lleno'); AC.sonido.tocar('click'); api.cambio(); b.focus(); } }, opcionNodo(o))));
          linea.pendientes.push(paneles[g.id]);
          return b;
        }
        const lista = h('ol', { class: 'lineas' }, e.lineas.map(l => {
          const li = h('li', { class: 'linea-hueco' }); li.pendientes = [];
          const cuerpo = h('div', { class: 'texto-linea' });
          l.partes.forEach(p => { if (typeof p === 'string') cuerpo.appendChild(ui.mate(p)); else cuerpo.appendChild(chip(e.huecos[p.gap], li)); });
          const just = h('div', { class: 'just-sel' }, h('span', { class: 'etq' }, 'Justificación: '), l.just.gap ? chip(e.huecos[l.just.gap], li) : h('span', { class: 'just-dada' }, AC.catalogo.nombreRef(l.just.ref)));
          li.append(cuerpo, just, ...li.pendientes); return li;
        }));
        return { el: lista, leer: () => Object.assign({}, sel),
          marcar(res) { Object.keys(e.huecos).forEach(id => { const ok = res.detalle ? res.detalle[id] : true; chips[id].classList.add(ok ? 'ok' : 'mal'); chips[id].after(marca(ok)); }); },
          bloquear() { Object.values(chips).forEach(b => { b.disabled = true; }); Object.values(paneles).forEach(p => { p.hidden = true; }); } };
      }
      case 'estrategia': {
        const sel = new Set(), name = 'es' + (++uid);
        const items = e.opciones.map((o, i) => h('label', { class: 'opcion', for: name + i }, h('input', { type: 'checkbox', id: name + i, onchange: ev => { ev.target.checked ? sel.add(o.id) : sel.delete(o.id); api.cambio(); } }), h('span', { class: 'texto-opcion' }, ui.mate(o.texto))));
        return { el: h('div', { class: 'opciones', role: 'group', 'aria-label': 'Estrategias' }, items), leer: () => [...sel],
          marcar(res) { e.opciones.forEach((o, i) => { const n = res.notas[o.id]; items[i].classList.add(n.valida ? 'ok' : 'mal'); items[i].appendChild(h('span', { class: 'nota-estrategia' }, h('strong', null, n.valida ? '✓ Sirve. ' : '✗ No sirve. '), n.nota)); }); },
          bloquear() { items.forEach(l => { l.querySelector('input').disabled = true; }); } };
      }
      case 'cazar': {
        const st = { linea: null, diag: null }, name = 'ca' + (++uid), nd = 'cd' + uid;
        const filas = e.lineas.map(l => h('label', { class: 'opcion linea-cazar' }, h('input', { type: 'radio', name, onchange: () => { st.linea = l.id; api.cambio(); } }), h('span', { class: 'texto-opcion' }, ui.mate(l.texto))));
        const ds = e.diagnosticos.map(d => h('label', { class: 'opcion' }, h('input', { type: 'radio', name: nd, onchange: () => { st.diag = d.id; api.cambio(); } }), h('span', { class: 'texto-opcion' }, d.texto)));
        return { el: h('div', null, h('p', { class: 'etiqueta' }, 'Marca la línea falsa'), h('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Líneas' }, filas), h('p', { class: 'etiqueta' }, 'Diagnóstico'), h('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Diagnóstico' }, ds)),
          leer: () => Object.assign({}, st), marcar(res) { const a = inst.verificador.args; e.lineas.forEach((l, i) => { if (l.id === a.linea) { filas[i].classList.add('ok'); filas[i].appendChild(h('span', { class: 'marca ok' }, '← la línea falsa')); } else if (l.id === st.linea) { filas[i].classList.add('mal'); filas[i].appendChild(marca(false)); } }); },
          bloquear() { [...filas, ...ds].forEach(l => { l.querySelector('input').disabled = true; }); } };
      }
      case 'redactar': {
        const ta = h('textarea', { rows: 6, class: 'redaccion', 'aria-label': 'Tu demostración', placeholder: 'Escribe aquí tu demostración con tus palabras…' });
        const modelo = h('div', { class: 'modelo', hidden: true }, h('h4', null, 'Respuesta modelo'), ui.parrafo(e.modelo));
        const checks = e.criterios.map(() => false);
        const lista = h('div', { class: 'opciones', hidden: true, role: 'group', 'aria-label': 'Autoevaluación' }, e.criterios.map((c, i) => h('label', { class: 'opcion' }, h('input', { type: 'checkbox', onchange: ev => { checks[i] = ev.target.checked; api.cambio(); } }), h('span', { class: 'texto-opcion' }, c))));
        const ver = h('button', { type: 'button', class: 'secundario', onclick: () => { modelo.hidden = false; lista.hidden = false; ver.disabled = true; api.cambio(); } }, 'Comparar con la respuesta modelo');
        return { el: h('div', null, h('p', { class: 'ayuda' }, 'Esto no lo corrige la máquina: tú te autoevalúas contra la respuesta modelo. Cuenta la mitad para el dominio.'), ta, ver, modelo, h('p', { class: 'etiqueta', hidden: true }), lista), leer: () => ({ checks: checks.slice(), visto: !modelo.hidden }), marcar() {}, bloquear() { ta.disabled = true; lista.querySelectorAll('input').forEach(i => { i.disabled = true; }); }, listo: () => !modelo.hidden };
      }
    }
    return { el: h('p', null, 'Tipo de ejercicio no soportado: ' + e.tipo), leer: () => null, marcar() {}, bloquear() {} };
  };
  if (typeof module !== 'undefined') module.exports = AC;
})(globalThis.AC = globalThis.AC || {});
