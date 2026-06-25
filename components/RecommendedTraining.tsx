import React from 'react';
import type { CuratedCourse } from './courseCuration';

interface RecommendedTrainingProps {
  courses: CuratedCourse[];
}

const fallbackLogo = 'https://www.gov.br/inpi/pt-br/central-de-conteudo/comunicacao/marca-do-inpi/logo_inpi_azul_fundo_transparente.png';

const RecommendedTraining: React.FC<RecommendedTrainingProps> = ({ courses }) => {
  if (!courses.length) {
    return (
      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900">
        <p className="font-semibold uppercase tracking-wide text-blue-700">Capacitação recomendada</p>
        <p className="mt-2">Não identificamos, para este conhecimento, nenhuma capacitação que tenha sido objeto de curadoria prévia.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Capacitação recomendada</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          course.link ? (
            <a
              key={`${course.curso}-${course.link}`}
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-slate-300 bg-[#f7f8fa] px-4 py-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
            >
              <p className="text-sm font-medium uppercase tracking-wide text-slate-600">
                {course.tematica || 'Capacitação'}
              </p>
              <h4 className="mt-2 text-xl font-bold leading-snug text-[#0b3b7a] sm:text-2xl">
                {course.curso}
              </h4>
              <div className="mt-4 flex items-end justify-between gap-3">
                <img
                  src={course.logoInstituicao || fallbackLogo}
                  alt={course.instituicao || 'Instituição'}
                  className="h-7 w-auto object-contain"
                  loading="lazy"
                />
                <div className="inline-flex items-center gap-1.5 text-lg font-semibold text-slate-600 sm:text-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.ch ? `${course.ch} HORAS` : 'CARGA HORÁRIA N/D'}</span>
                </div>
              </div>
            </a>
          ) : (
            <div
              key={`${course.curso}-nolink`}
              className="rounded-xl border border-slate-300 bg-[#f7f8fa] px-4 py-4 shadow-sm"
            >
              <p className="text-sm font-medium uppercase tracking-wide text-slate-600">
                {course.tematica || 'Capacitação'}
              </p>
              <h4 className="mt-2 text-xl font-bold leading-snug text-[#0b3b7a] sm:text-2xl">
                {course.curso}
              </h4>
              <div className="mt-4 flex items-end justify-between gap-3">
                <img
                  src={course.logoInstituicao || fallbackLogo}
                  alt={course.instituicao || 'Instituição'}
                  className="h-7 w-auto object-contain"
                  loading="lazy"
                />
                <div className="inline-flex items-center gap-1.5 text-lg font-semibold text-slate-600 sm:text-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.ch ? `${course.ch} HORAS` : 'CARGA HORÁRIA N/D'}</span>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default RecommendedTraining;
