import React, { useState } from 'react';
import UserInfoForm from './UserInfoForm';
import {
  CheckCircle, Circle,
  BarChart3, Target, Cpu, Users,
  Award, TrendingUp
} from 'lucide-react';

const QuizMyPublic = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const sections = [
    {
      title: "ESTRATÉGIA",
      icon: <Target className="w-6 h-6" />,
      questions: [
        "CX está integrado ao planejamento estratégico da marca?",
        "Existem métricas específicas de experiência atreladas a resultados de negócio?",
        "Liderança executiva participa ativamente de decisões sobre customer journey?"
      ]
    },
    {
      title: "OPERAÇÃO",
      icon: <BarChart3 className="w-6 h-6" />,
      questions: [
        "Dados de diferentes touchpoints são integrados em visão única do cliente?",
        "Equipes trabalham colaborativamente ou em silos funcionais?",
        "Processos são desenhados a partir da perspectiva do cliente?"
      ]
    },
    {
      title: "TECNOLOGIA",
      icon: <Cpu className="w-6 h-6" />,
      questions: [
        "Plataformas tecnológicas permitem personalização em escala?",
        "IA é aplicada para antecipar necessidades do cliente?",
        "Automação preserva humanização nos momentos críticos?"
      ]
    },
    {
      title: "CULTURA",
      icon: <Users className="w-6 h-6" />,
      questions: [
        "Colaboradores compreendem impacto individual na experiência total?",
        "Organização aprende e evolui com feedback dos clientes?",
        "Inovação em CX é incentivada e recompensada?"
      ]
    }
  ];

  const maturityLevels = [
    {
      level: "REATIVO",
      range: "0-3 SIM",
      color: "from-red-500 to-red-600",
      icon: "🔴",
      description: "Sua marca responde a problemas ao invés de antecipar necessidades.",
      recommendation: "Priorize trilhas de Fundamentos CX e Estratégia no CONAREC",
      focus: "Estabelecer bases sólidas e visão integrada"
    },
    {
      level: "ESTRUTURADO",
      range: "4-6 SIM",
      color: "from-yellow-500 to-yellow-600",
      icon: "🟡",
      description: "Processos existem mas falta integração e visão sistêmica.",
      recommendation: "Explore trilhas de Tecnologia CX e Transformação Digital",
      focus: "Integrar touchpoints e otimizar jornadas"
    },
    {
      level: "OTIMIZADO",
      range: "7-9 SIM",
      color: "from-green-500 to-green-600",
      icon: "🟢",
      description: "CX é prioridade mas ainda há potencial de diferenciação.",
      recommendation: "Participe das trilhas de Inovação e Liderança CX",
      focus: "Criar vantagens competitivas sustentáveis"
    },
    {
      level: "TRANSFORMADOR",
      range: "10-12 SIM",
      color: "from-blue-500 to-blue-600",
      icon: "🔵",
      description: "Sua marca define padrões de mercado em experiência.",
      recommendation: "Lidere discussões nas trilhas de Visão Global e Futuro CX",
      focus: "Compartilhar expertise e moldar tendências"
    }
  ];

  const handleAnswer = (questionIndex, value) => {
    const globalIndex = currentSection * 3 + questionIndex;
    setAnswers(prev => ({
      ...prev,
      [globalIndex]: value
    }));
  };

  const getScore = () => {
    return Object.values(answers).filter(Boolean).length;
  };

  const getMaturityLevel = () => {
    const score = getScore();
    if (score <= 3) return maturityLevels[0];
    if (score <= 6) return maturityLevels[1];
    if (score <= 9) return maturityLevels[2];
    return maturityLevels[3];
  };

  const canProceed = () => {
    const sectionStart = currentSection * 3;
    for (let i = 0; i < 3; i++) {
      if (answers[sectionStart + i] === undefined) return false;
    }
    return true;
  };

  const submitToGoogleSheets = async () => {
    const payload = {
      name: userInfo.name,
      email: userInfo.email,
      answers: Object.values(answers).map(ans => (ans ? 'SIM' : 'NÃO')),
      score: getScore(),
      maturity: getMaturityLevel().level
    };

    try {
      await fetch("https://script.google.com/a/macros/leadrix.com.br/s/AKfycbwR9t-JIzQ47fD8m5oLXpAbDLIylBEMes2YPP-dK6G61QV8EkRw4Vgrg-cX1Qg__UEP/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Erro ao enviar para o Google Sheets:", error);
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      submitToGoogleSheets();
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentSection(0);
    setAnswers({});
    setShowResults(false);
    setUserInfo(null); // para voltar pro formulário também
  };

  if (!userInfo) {
    return <UserInfoForm onSubmit={setUserInfo} />;
  }

  if (showResults) {
    const level = getMaturityLevel();
    const score = getScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 ml-3">CONAREC 2025</h1>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-8 mb-6">
            <div className={`inline-block px-6 py-3 bg-gradient-to-r ${level.color} text-white rounded-full text-xl font-bold mb-4`}>
              {level.icon} {level.level}
            </div>
            <p className="text-xl text-gray-600 mb-2">Pontuação: <strong>{score}/12</strong></p>
            <p className="text-gray-500 mb-4">({level.range})</p>
            <p className="text-gray-700">{level.description}</p>
          </div>

          <div className="space-y-4 text-left max-w-2xl mx-auto mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recomendação CONAREC</h2>
              <p className="text-blue-700">{level.recommendation}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Foco de Desenvolvimento</h2>
              <p className="text-gray-700">{level.focus}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button onClick={restartQuiz} className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
              Refazer Assessment
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold shadow-md hover:from-gray-800 hover:to-gray-900">
              Descobrir Trilhas CONAREC
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">CONAREC 2025</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            Sua marca está preparada para a revolução CX 2025?
          </h2>
          <p className="text-gray-600 mt-2">
            Assessment com insights de +150 CEOs do CONAREC. 12 perguntas. Diagnóstico preciso.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              {sections[currentSection].icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{sections[currentSection].title}</h3>
          </div>

          <div className="space-y-4">
            {sections[currentSection].questions.map((question, i) => {
              const globalIndex = currentSection * 3 + i;
              const answer = answers[globalIndex];

              return (
                <div key={i} className="border p-4 rounded-lg">
                  <p className="text-gray-800 mb-3 font-medium">
                    {globalIndex + 1}. {question}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswer(i, true)}
                      className={`px-5 py-2 rounded-lg border-2 flex items-center gap-2 transition ${
                        answer === true
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {answer === true ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      SIM
                    </button>
                    <button
                      onClick={() => handleAnswer(i, false)}
                      className={`px-5 py-2 rounded-lg border-2 flex items-center gap-2 transition ${
                        answer === false
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : 'border-gray-300 hover:border-red-400'
                      }`}
                    >
                      {answer === false ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      NÃO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="px-4 py-2 border rounded-lg text-blue-600 border-blue-600 hover:bg-blue-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={nextSection}
              disabled={!canProceed()}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
            >
              {currentSection === sections.length - 1 ? 'Ver Resultado' : 'Próxima Seção'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizMyPublic;
