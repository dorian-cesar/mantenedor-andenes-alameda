export function LoginCard1({ icon, title, description }) {
    return (
        <div className="flex items-center gap-4 p-4 border rounded-xl bg-[#FFFFFF14]">
            {icon}
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-blue-100">{description}</p>
            </div>
        </div>
    )
}

export function LoginCard2() {
    return (
        <div className="flex items-center gap-4 p-4 border rounded-xl bg-[#FFFFFF14]">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold">SOMOS WIT</h2>
          </div>
          <p className="text-lg text-blue-100 mb-4 leading-relaxed">
            Empresa de desarrollo de productos y soluciones tecnológicas.
            Especialistas en creación, diseño e implementación de herramientas
            para optimizar procesos empresariales.
          </p>
          <p className="text-blue-100 leading-relaxed">
            Fortaleza basada en TIC y NTIC para desarrollo profesional y
            sustentabilidad financiera.
          </p>
          <div className="mt-8">
            <div className="w-16 h-1 bg-blue-300 rounded-full mb-4"></div>
            <p className="text-blue-200 text-sm">Transformando ideas en soluciones digitales</p>
          </div>
        </div>
        </div>
    )
}