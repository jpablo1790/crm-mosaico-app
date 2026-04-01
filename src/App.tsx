import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import {
  Building2,
  MapPin,
  Calculator,
  Search,
  PlusCircle,
  LayoutDashboard,
  Map,
  Calendar,
  DollarSign,
  Camera,
  User,
  Tag,
  Home,
  Filter,
  Cloud,
  CloudOff,
  Link as LinkIcon,
} from 'lucide-react';

// --- IMPORTACIONES DE FIREBASE ---
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
} from 'firebase/firestore';

// --- TU CONFIGURACIÓN REAL DE FIREBASE ---
const firebaseConfig = {
  apiKey: 'AIzaSyAq2rnGCDcAI0AmtKKp3IwUCruoKSaSTkQ',
  authDomain: 'crm---mosaico.firebaseapp.com',
  projectId: 'crm---mosaico',
  storageBucket: 'crm---mosaico.firebasestorage.app',
  messagingSenderId: '559659207609',
  appId: '1:559659207609:web:6fc435a2a120b48ecd8468',
  measurementId: 'G-BJQP00NNX9',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// Usamos un identificador para la estructura de tu base de datos
const platformAppId =
  typeof __app_id !== 'undefined' ? __app_id : 'crm-mosaico-db';

// --- DATOS REALES DE MOSAICOINMOBILIARIO.COM (Para siembra inicial) ---
const initialData = [
  {
    id: 1,
    country: 'Colombia',
    department: 'Antioquia',
    city: 'Envigado',
    neighborhood: 'Loma del Escobero',
    propertyType: 'Casa Campestre',
    operationType: 'Venta',
    status: 'Venta real',
    builtArea: 350,
    landArea: 1200,
    patioArea: 800,
    yearBuilt: 2018,
    stratum: '5',
    bedrooms: 4,
    bathrooms: 5,
    parking: 3,
    price: 2500000000,
    complexName: 'Parcelación Bosques',
    googleMaps: '',
    colleague: 'Venta directa',
    date: '2025-08-15',
    notes: 'Venta confirmada en notaría.',
    photos: [],
  },
  {
    id: 3,
    country: 'Colombia',
    department: 'Antioquia',
    city: 'Medellín',
    neighborhood: 'El Poblado',
    propertyType: 'Apartamento',
    operationType: 'Venta',
    status: 'Venta real',
    builtArea: 120,
    landArea: 0,
    patioArea: 0,
    yearBuilt: 2020,
    stratum: '6',
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    price: 1100000000,
    complexName: 'Torres del Poblado',
    googleMaps: '',
    colleague: 'Referencia interna',
    date: '2025-11-20',
    notes: 'Remodelado hace 1 año.',
    photos: [],
  },
  {
    id: 101,
    country: 'Colombia',
    department: 'Antioquia',
    city: 'Rionegro',
    neighborhood: 'Llanogrande',
    propertyType: 'Casa Campestre',
    operationType: 'Venta',
    status: 'Oferta',
    builtArea: 450,
    landArea: 2500,
    patioArea: 100,
    yearBuilt: 2021,
    stratum: '5',
    bedrooms: 3,
    bathrooms: 5,
    parking: 6,
    price: 7000000000,
    complexName: 'Parcelación Llanogrande',
    googleMaps: '',
    colleague: 'Mosaico Inmobiliario',
    date: '2026-04-01',
    notes: 'Casa en venta o arriendo en parcelación - Llanogrande',
    photos: [],
  },
  {
    id: 102,
    country: 'Colombia',
    department: 'Antioquia',
    city: 'Medellín',
    neighborhood: 'La Calera (El Poblado)',
    propertyType: 'Casa Campestre',
    operationType: 'Venta',
    status: 'Oferta',
    builtArea: 380,
    landArea: 1500,
    patioArea: 50,
    yearBuilt: 2019,
    stratum: '6',
    bedrooms: 2,
    bathrooms: 4,
    parking: 3,
    price: 6500000000,
    complexName: 'Parcelación La Calera',
    googleMaps: '',
    colleague: 'Mosaico Inmobiliario',
    date: '2026-04-01',
    notes: 'Casa espectacular en parcelación - La Calera',
    photos: [],
  },
  {
    id: 105,
    country: 'Colombia',
    department: 'Antioquia',
    city: 'Venecia',
    neighborhood: 'Rural',
    propertyType: 'Finca',
    operationType: 'Venta',
    status: 'Oferta',
    builtArea: 0,
    landArea: 15000,
    patioArea: 0,
    yearBuilt: '',
    stratum: 'Campestre / No aplica',
    bedrooms: 4,
    bathrooms: 5,
    parking: 10,
    price: 4500000000,
    complexName: '',
    googleMaps: '',
    colleague: 'Mosaico Inmobiliario',
    date: '2026-03-15',
    notes: 'Finca en venta - Venecia Antioquia',
    photos: [],
  },
  {
    id: 108,
    country: 'Colombia',
    department: 'Antioquia',
    city: 'Medellín',
    neighborhood: 'La Aguacatala',
    propertyType: 'Apartamento',
    operationType: 'Venta',
    status: 'Oferta',
    builtArea: 95,
    landArea: 0,
    patioArea: 0,
    yearBuilt: 2015,
    stratum: '5',
    bedrooms: 2,
    bathrooms: 3,
    parking: 2,
    price: 900000000,
    complexName: '',
    googleMaps: '',
    colleague: 'Mosaico Inmobiliario',
    date: '2026-02-28',
    notes: 'Apartamento a la Venta',
    photos: [],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('consulta');
  const [properties, setProperties] = useState([]);

  // --- ESTADOS DE FIREBASE ---
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- ESTADO DEL FORMULARIO ---
  const initialFormState = {
    country: 'Colombia',
    department: 'Antioquia',
    city: '',
    neighborhood: '',
    propertyType: 'Apartamento',
    operationType: 'Venta',
    status: 'Oferta',
    builtArea: '',
    landArea: '',
    patioArea: '',
    yearBuilt: '',
    stratum: '4',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    price: '',
    complexName: '',
    googleMaps: '',
    colleague: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    photoUrlInput: '',
    photos: [],
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- ESTADO DE FILTROS ---
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    operationType: 'Venta',
    status: '',
  });

  // ==========================================
  // 0. CARGAR ESTILOS DE DISEÑO (TAILWIND)
  // ==========================================
  useEffect(() => {
    // Inyecta el script de colores y estilos si no está presente
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  // ==========================================
  // 1. INICIAR AUTENTICACIÓN (ANÓNIMA)
  // ==========================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== 'undefined' &&
          __initial_auth_token
        ) {
          try {
            await signInWithCustomToken(auth, __initial_auth_token);
          } catch (tokenError) {
            console.log(
              'Cambiando a Firebase personalizado de Mosaico (Autenticación Anónima)...'
            );
            await signInAnonymously(auth);
          }
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error('Error general de autenticación:', error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ==========================================
  // 2. CONECTAR Y ESCUCHAR BASE DE DATOS
  // ==========================================
  useEffect(() => {
    if (!user) return;

    // Ruta en tu base de datos
    const propertiesRef = collection(
      db,
      'artifacts',
      platformAppId,
      'users',
      user.uid,
      'properties'
    );

    const unsubscribe = onSnapshot(
      propertiesRef,
      (snapshot) => {
        if (snapshot.empty) {
          // Si tu DB está vacía, sembramos los datos iniciales de Mosaico Inmobiliario
          console.log('DB vacía, subiendo datos iniciales a Firebase...');
          initialData.forEach(async (item) => {
            try {
              await setDoc(doc(propertiesRef, item.id.toString()), item);
            } catch (e) {
              console.error('Error guardando dato inicial:', e);
            }
          });
        } else {
          // Cargar los datos desde Firebase
          const loadedData = snapshot.docs.map((doc) => ({
            dbId: doc.id,
            ...doc.data(),
          }));
          setProperties(loadedData);
        }
      },
      (error) => {
        console.error('Error al conectar con Firestore:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ==========================================
  // MANEJO DE FORMULARIO
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addPhotoUrl = () => {
    if (formData.photoUrlInput && formData.photoUrlInput.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, prev.photoUrlInput],
        photoUrlInput: '',
      }));
    }
  };

  const removePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Conectando a la base de datos... Por favor espera un segundo.');
      return;
    }

    setIsSaving(true);

    const newProperty = {
      country: formData.country,
      department: formData.department,
      city: formData.city,
      neighborhood: formData.neighborhood,
      propertyType: formData.propertyType,
      operationType: formData.operationType,
      status: formData.status,
      builtArea: Number(formData.builtArea) || 0,
      landArea: Number(formData.landArea) || 0,
      patioArea: Number(formData.patioArea) || 0,
      yearBuilt: formData.yearBuilt,
      stratum: formData.stratum,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      parking: Number(formData.parking) || 0,
      price: Number(formData.price) || 0,
      complexName: formData.complexName,
      googleMaps: formData.googleMaps,
      colleague: formData.colleague,
      date: formData.date,
      notes: formData.notes,
      photos: formData.photos,
      timestamp: Date.now(),
    };

    try {
      const propertiesRef = collection(
        db,
        'artifacts',
        platformAppId,
        'users',
        user.uid,
        'properties'
      );
      await addDoc(propertiesRef, newProperty);
      setFormData(initialFormState);
      setActiveTab('consulta');
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Hubo un error al guardar. Revisa la conexión.');
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // EXPORTAR A CSV
  // ==========================================
  const exportToCSV = () => {
    if (filteredProperties.length === 0) return;
    const headers = [
      'Fecha',
      'Tipo Operacion',
      'Estado',
      'Tipo Inmueble',
      'Ciudad',
      'Barrio',
      'Area Lote',
      'Area Construida',
      'Habitaciones',
      'Banos',
      'Precio Total',
      'Valor por m2',
      'Contacto',
      'Notas',
    ];
    const rows = filteredProperties.map((p) => {
      const area = ['Lote', 'Finca'].includes(p.propertyType)
        ? p.landArea
        : p.builtArea;
      const valM2 = area > 0 ? p.price / area : 0;
      const safeNotes = `"${(p.notes || '').replace(/"/g, '""')}"`;
      const safeNeighborhood = `"${(p.neighborhood || '').replace(
        /"/g,
        '""'
      )}"`;
      return [
        p.date,
        p.operationType,
        p.status,
        p.propertyType,
        p.city,
        safeNeighborhood,
        p.landArea,
        p.builtArea,
        p.bedrooms,
        p.bathrooms,
        p.price,
        Math.round(valM2),
        `"${p.colleague || ''}"`,
        safeNotes,
      ].join(',');
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `mosaico_comparables_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // LÓGICA DE ANÁLISIS Y FILTROS
  // ==========================================
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        const matchCity =
          filters.city === '' ||
          p.city.toLowerCase().includes(filters.city.toLowerCase());
        const matchType =
          filters.propertyType === '' ||
          p.propertyType === filters.propertyType;
        const matchOp =
          filters.operationType === '' ||
          p.operationType === filters.operationType;
        const matchStatus =
          filters.status === '' || p.status === filters.status;
        return matchCity && matchType && matchOp && matchStatus;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [properties, filters]);

  const marketStats = useMemo(() => {
    if (filteredProperties.length === 0)
      return { avgPrice: 0, avgPriceM2: 0, total: 0 };

    let totalM2Price = 0;
    let validM2Count = 0;
    let totalPrice = 0;

    filteredProperties.forEach((p) => {
      totalPrice += p.price;
      const areaToUse = ['Lote', 'Finca'].includes(p.propertyType)
        ? p.landArea
        : p.builtArea;
      if (areaToUse > 0) {
        totalM2Price += p.price / areaToUse;
        validM2Count++;
      }
    });

    return {
      total: filteredProperties.length,
      avgPrice: totalPrice / filteredProperties.length,
      avgPriceM2: validM2Count > 0 ? totalM2Price / validM2Count : 0,
    };
  }, [filteredProperties]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isLand = ['Lote', 'Terreno'].includes(formData.propertyType);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      {/* HEADER NAVBAR */}
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-3 sm:py-0 gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-xl tracking-tight">
                Mosaico CRM
              </span>
              {/* Indicador de Nube */}
              {user ? (
                <div
                  className="flex items-center gap-1 ml-2 px-2 py-1 bg-emerald-900/50 rounded-full text-xs text-emerald-400 border border-emerald-800"
                  title="Conectado a la nube"
                >
                  <Cloud className="h-3 w-3" /> Conectado
                </div>
              ) : (
                <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-red-900/50 rounded-full text-xs text-red-400 border border-red-800">
                  <CloudOff className="h-3 w-3" /> Conectando...
                </div>
              )}
            </div>
            <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveTab('consulta')}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'consulta'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Base de Datos
              </button>
              <button
                onClick={() => setActiveTab('registro')}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'registro'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                Registrar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* PESTAÑA DE REGISTRO */}
        {activeTab === 'registro' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-500" />
                Nueva Captación o Comparable
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-8">
              {/* Sección 1 */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                  1. Ubicación y Tipo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      País
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Depto.
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Barrio / Vereda
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Tipo
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Apartamento</option>
                      <option>Casa</option>
                      <option>Casa Campestre</option>
                      <option>Lote</option>
                      <option>Finca</option>
                      <option>Bodega</option>
                      <option>Local</option>
                      <option>Oficina</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Estrato
                    </label>
                    <select
                      name="stratum"
                      value={formData.stratum}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Campestre / No aplica</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>Comercial</option>
                      <option>Industrial</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Edificio / Parcelación
                    </label>
                    <input
                      type="text"
                      name="complexName"
                      value={formData.complexName}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Opcional"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2 */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                  2. Áreas y Características
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {!isLand && (
                    <>
                      <div>
                        <label className="block text-sm mb-1 text-slate-700 font-medium">
                          Área Construida (m²)
                        </label>
                        <input
                          type="number"
                          name="builtArea"
                          value={formData.builtArea}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-slate-700 font-medium">
                          Año Construcción
                        </label>
                        <input
                          type="number"
                          name="yearBuilt"
                          value={formData.yearBuilt}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Ej: 2015"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Área Terreno/Lote (m²)
                    </label>
                    <input
                      type="number"
                      name="landArea"
                      value={formData.landArea}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  {!isLand && (
                    <>
                      <div>
                        <label className="block text-sm mb-1 text-slate-700 font-medium">
                          Área Patio (m²)
                        </label>
                        <input
                          type="number"
                          name="patioArea"
                          value={formData.patioArea}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-slate-700 font-medium">
                          Habitaciones
                        </label>
                        <input
                          type="number"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-slate-700 font-medium">
                          Baños
                        </label>
                        <input
                          type="number"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-slate-700 font-medium">
                          Parqueaderos
                        </label>
                        <input
                          type="number"
                          name="parking"
                          value={formData.parking}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sección 3 */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                  3. Datos de Mercado
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Tipo de Operación
                    </label>
                    <select
                      name="operationType"
                      value={formData.operationType}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Venta</option>
                      <option>Arriendo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Estado
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Oferta (Asking Price)</option>
                      <option>Venta real (Cierre)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Fecha del Dato
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Valor Total (COP)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold text-lg"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Colega / Contacto
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="colleague"
                        value={formData.colleague}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Nombre"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 4 */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                  4. Multimedia y Notas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Link Google Maps
                    </label>
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="url"
                        name="googleMaps"
                        value={formData.googleMaps}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <label className="block text-sm mb-1 text-slate-700 font-medium">
                      Observaciones
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                      placeholder="Detalles..."
                    ></textarea>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="block text-sm font-medium text-slate-800 mb-1 flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" /> Enlaces a Fotos
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Pega el enlace web (URL) de la imagen para ahorrar espacio
                      en la base de datos de tu celular.
                    </p>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="url"
                        name="photoUrlInput"
                        value={formData.photoUrlInput}
                        onChange={handleInputChange}
                        className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={addPhotoUrl}
                        className="bg-slate-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
                      >
                        Añadir
                      </button>
                    </div>

                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                        {formData.photos.map((src, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-md overflow-hidden bg-slate-200 aspect-square border border-slate-300"
                          >
                            <img
                              src={src}
                              alt="Propiedad"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'https://placehold.co/400x400/e2e8f0/64748b?text=Link+Roto';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`flex items-center gap-2 font-semibold py-2 px-6 rounded-md shadow-sm transition-colors ${
                    isSaving
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Calculator className="h-5 w-5" />
                  {isSaving
                    ? 'Guardando en la nube...'
                    : 'Guardar en Base de Datos'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PESTAÑA DE CONSULTA Y ANÁLISIS */}
        {activeTab === 'consulta' && (
          <div className="space-y-6">
            {/* Botón Exportar arriba */}
            <div className="flex justify-end mb-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-white py-1.5 px-4 rounded-md shadow-sm transition-colors"
              >
                Descargar Excel (CSV)
              </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
                <Filter className="h-5 w-5 text-blue-500" />
                Filtros de Mercado
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Ciudad / Sector
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) =>
                      setFilters({ ...filters, city: e.target.value })
                    }
                    placeholder="Ej: Envigado"
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Tipo de Propiedad
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) =>
                      setFilters({ ...filters, propertyType: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">Todos</option>
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Casa Campestre</option>
                    <option>Lote</option>
                    <option>Local</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Operación
                  </label>
                  <select
                    value={filters.operationType}
                    onChange={(e) =>
                      setFilters({ ...filters, operationType: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">Todas</option>
                    <option value="Venta">Venta</option>
                    <option value="Arriendo">Arriendo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Estado
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">Todos</option>
                    <option value="Oferta">Ofertas (Asking Price)</option>
                    <option value="Venta real">Ventas Reales</option>
                  </select>
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                  <Calculator className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Valor Promedio M²
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(marketStats.avgPriceM2)}
                  </p>
                  <p className="text-xs text-slate-400">
                    Basado en tu selección
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
                  <DollarSign className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Valor Promedio Total
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(marketStats.avgPrice)}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Comparables Encontrados
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {marketStats.total}
                  </p>
                  <p className="text-xs text-slate-400">
                    Inmuebles en el filtro
                  </p>
                </div>
              </div>
            </div>

            {/* Gráfica */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                Evolución del Precio por M² en el Tiempo
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Muestra la tendencia del mercado según fechas.
              </p>

              <div className="h-80 w-full">
                {filteredProperties.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="date"
                        name="Fecha"
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickFormatter={(tick) =>
                          new Date(tick).toLocaleDateString('es-CO', {
                            month: 'short',
                            year: 'numeric',
                          })
                        }
                      />
                      <YAxis
                        dataKey={(row) => {
                          const area = ['Lote', 'Finca'].includes(
                            row.propertyType
                          )
                            ? row.landArea
                            : row.builtArea;
                          return area > 0 ? row.price / area : 0;
                        }}
                        name="Valor M2"
                        tickFormatter={(tick) =>
                          `$${(tick / 1000000).toFixed(1)}M`
                        }
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <ZAxis range={[60, 60]} />
                      <RechartsTooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const area = ['Lote', 'Finca'].includes(
                              data.propertyType
                            )
                              ? data.landArea
                              : data.builtArea;
                            const valM2 = area > 0 ? data.price / area : 0;
                            return (
                              <div className="bg-slate-800 text-white p-3 rounded-md shadow-lg text-sm border border-slate-700">
                                <p className="font-bold border-b border-slate-600 pb-1 mb-1">
                                  {data.neighborhood}, {data.city}
                                </p>
                                <p>Fecha: {data.date}</p>
                                <p>Tipo: {data.status}</p>
                                <p className="text-blue-300 font-semibold mt-1">
                                  Valor M²: {formatCurrency(valM2)}
                                </p>
                                <p className="text-xs text-slate-300">
                                  Precio: {formatCurrency(data.price)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Scatter
                        name="Ofertas"
                        data={filteredProperties.filter((p) =>
                          p.status.includes('Oferta')
                        )}
                        fill="#3b82f6"
                      />
                      <Scatter
                        name="Ventas Reales"
                        data={filteredProperties.filter((p) =>
                          p.status.includes('Venta real')
                        )}
                        fill="#10b981"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    No hay suficientes datos para graficar con los filtros
                    actuales.
                  </div>
                )}
              </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  Registros Detallados ({filteredProperties.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-3 text-left">Fecha</th>
                      <th className="px-6 py-3 text-left">Ubicación</th>
                      <th className="px-6 py-3 text-left">Tipo / Estado</th>
                      <th className="px-6 py-3 text-right">Área</th>
                      <th className="px-6 py-3 text-right">Valor Total</th>
                      <th className="px-6 py-3 text-right">Valor M²</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredProperties.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-8 text-center text-slate-500"
                        >
                          No se encontraron inmuebles.
                        </td>
                      </tr>
                    )}
                    {filteredProperties.map((prop) => {
                      const area = ['Lote', 'Finca'].includes(prop.propertyType)
                        ? prop.landArea
                        : prop.builtArea;
                      const valM2 = area > 0 ? prop.price / area : 0;
                      return (
                        <tr
                          key={prop.dbId}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                            {prop.date}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">
                              {prop.neighborhood}
                            </div>
                            <div className="text-xs text-slate-500">
                              {prop.city}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-800">
                              {prop.propertyType}
                            </div>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                prop.status.includes('Venta real')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {prop.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-slate-600">
                            {area} m²{' '}
                            <span className="text-xs text-slate-400">
                              (
                              {['Lote', 'Finca'].includes(prop.propertyType)
                                ? 'Lote'
                                : 'Const.'}
                              )
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-900">
                            {formatCurrency(prop.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-blue-600 font-semibold">
                            {formatCurrency(valM2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
