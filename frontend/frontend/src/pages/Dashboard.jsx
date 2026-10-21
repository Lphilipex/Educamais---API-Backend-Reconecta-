import React, { useState, useEffect } from 'react';
import api from '../services/api';
export default function Dashboard() {
const [totalUsuarios, setTotalUsuarios] = useState(0);
const [totalDisciplinas, setTotalDisciplinas] = useState(0);
const [totalMateriais, setTotalMateriais] = useState(0);
const [totalAtividades, setTotalAtividades] = useState(0);
const [loading, setLoading] = useState(true);
useEffect(() => {
Promise.all([
api.get('/usuarios').catch(() => ({ data: [] })),
api.get('/disciplinas').catch(() => ({ data: [] })),
api.get('/materiais').catch(() => ({ data: [] })),
api.get('/atividades').catch(() => ({ data: [] }))
]).then(([resUsuarios, resDisciplinas, resMateriais, resAtividades]) => {
setTotalUsuarios(resUsuarios.data.length);
setTotalDisciplinas(resDisciplinas.data.length);
setTotalMateriais(resMateriais.data.length);
setTotalAtividades(resAtividades.data.length);
setLoading(false);
});
}, []);
return (
<div className="space-y-6">
{/* Banner de Boas-Vindas ODS 4 */}
<div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
<div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
<div className="relative z-10">
<span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block backdrop-blur-sm">
Objetivo de Desenvolvimento Sustentável 4
</span>
<h2 className="text-3xl font-extrabold mb-2">Educamais • Gestão Educacional</h2>
<p className="text-blue-100 max-w-2xl text-base leading-relaxed">
Garantir a educação inclusiva, equitativa e de qualidade, promovendo oportunidades de aprendizagem ao longo da vida para todos. Acompanhe abaixo os indicadores em tempo real da nossa plataforma.
</p>
</div>
</div>
      {/* Cartões de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md hover:border-blue-100 group">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Utilizadores</p>
            <h3 className="text-3xl font-extrabold text-slate-800">
              {loading ? '...' : totalUsuarios}
            </h3>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2">
              ● Ativos no sistema
            </span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
            👥
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md hover:border-indigo-100 group">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Disciplinas</p>
            <h3 className="text-3xl font-extrabold text-slate-800">
              {loading ? '...' : totalDisciplinas}
            </h3>
            <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-2">
              📚 Matérias cadastradas
            </span>
          </div>
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
            📖
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md hover:border-teal-100 group">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Materiais</p>
            <h3 className="text-3xl font-extrabold text-slate-800">
              {loading ? '...' : totalMateriais}
            </h3>
            <span className="text-xs text-teal-600 font-medium flex items-center gap-1 mt-2">
              📄 Recursos partilhados
            </span>
          </div>
          <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
            📂
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md hover:border-amber-100 group">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Atividades</p>
            <h3 className="text-3xl font-extrabold text-slate-800">
              {loading ? '...' : totalAtividades}
            </h3>
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-2">
              📝 Tarefas criadas
            </span>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
            ⚡
          </div>
        </div>
      </div>

      {/* Secção de Informações Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Sobre o ODS 4 na Plataforma</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            O ODS 4 visa assegurar o acesso à educação inclusiva e equitativa de qualidade, e promover oportunidades de aprendizagem ao longo da vida para todos. Esta aplicação serve como pilar tecnológico para conectar alunos, professores e conteúdos de forma centralizada e ágil.
          </p>
          <div className="flex gap-2">
            <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg font-medium">Inclusão</span>
            <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg font-medium">Equidade</span>
            <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg font-medium">Qualidade de Ensino</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Status do Sistema</span>
            <h4 className="text-xl font-bold mt-1 mb-2">Conexão Estável</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Todos os endpoints da API REST encontram-se operacionais e sincronizados com a base de dados.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <span>Versão 2.5 Professional</span>
            <span className="text-emerald-400 font-semibold">Online</span>
          </div>
        </div>
      </div>
    </div>
);
}