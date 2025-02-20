import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { Download, FileText, Home, ClipboardList, History, List } from 'lucide-react';
import { FormData, Section, FormType } from './types';
const initialFormData: FormData = {
  name: '',
  email: '',
  mobile: '',
  department: '',
  photo: '',
  date: '',
  objective: '',
  report: '',
  eventName: '',
  dateFrom: '',
  dateTo: '',
};
const departments = [
  'Computer Science',
  'Electrical',
  'EEE',
  'AI',
  'Mechanical',
  'Automobile'
];
const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [activeForm, setActiveForm] = useState<FormType>('form1');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [reports, setReports] = useState<FormData[]>(() => {
    const savedReports = localStorage.getItem('reports');
    return savedReports ? JSON.parse(savedReports) : [];
  });
  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setFormData({ ...formData, photo: file, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setPreview(true);
      setLoading(false);
    }, 1000);
  };
  const handleFinalSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const newReport = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        photoUrl: photoPreview 
      };
      setReports([...reports, newReport]);
    }, 1000);
  };
  const downloadPDF = (report: FormData) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Report Details', 10, 10);
    doc.text(`Name: ${report.name}`, 10, 20);
    doc.text(`Email: ${report.email}`, 10, 30);
    doc.text(`Department: ${report.department}`, 10, 40);
    doc.text(`Date: ${report.date}`, 10, 50);
    doc.text(`Objective: ${report.objective}`, 10, 60);
    doc.text(`Report: ${report.report}`, 10, 70);
    if (report.photoUrl) {
      doc.addImage(report.photoUrl, 'JPEG', 10, 80, 50, 50);
    }
    doc.save(`report-${report.id}.pdf`);
  };
  const generateWord = (report: FormData) => {
    const content = `
      Report Details\n
      Name: ${report.name}\n
      Email: ${report.email}\n
      Department: ${report.department}\n
      Date: ${report.date}\n
      Objective: ${report.objective}\n
      Report: ${report.report}\n
    `;
    const blob = new Blob([content], { type: 'application/msword' });
    saveAs(blob, `report-${report.id}.doc`);
  };
  const ReportCard: React.FC<{ report: FormData }> = ({ report }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border p-6 rounded-lg mb-4 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">{report.name}</h3>
          <div className="space-y-2">
            <p className="text-gray-600"><span className="font-medium">Email:</span> {report.email}</p>
            <p className="text-gray-600"><span className="font-medium">Department:</span> {report.department}</p>
            <p className="text-gray-600"><span className="font-medium">Date:</span> {new Date(report.date).toLocaleDateString()}</p>
            <p className="text-gray-600"><span className="font-medium">Mobile:</span> {report.mobile}</p>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-800">Objective:</h4>
            <p className="text-gray-600 mt-1">{report.objective}</p>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-800">Report:</h4>
            <p className="text-gray-600 mt-1">{report.report}</p>
          </div>
        </div>
        {report.photoUrl && (
          <div className="flex flex-col items-center">
            <img src={report.photoUrl} alt="Report" className="rounded-lg max-w-full h-auto shadow-md" />
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => downloadPDF(report)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => generateWord(report)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          Download Word
        </motion.button>
      </div>
    </motion.div>
    );
    return (
    <div className="min-h-screen bg-gray-100">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-blue-800 text-white py-6 px-4 shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-6 space-x-4">
        <img src="Sri Krishna college of Technology Coimbature logo.png" alt="College Logo" className="h-12 w-12 object-contain" />
        <h1 className="text-3xl font-bold">Sri Krishna Arts and Science College</h1>
        </div>
          <nav className="flex flex-wrap justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection('home')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'home' ? 'bg-white text-blue-800' : 'bg-blue-700 text-white'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection('eventReport')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'eventReport' ? 'bg-white text-blue-800' : 'bg-blue-700 text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Event Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection('recentReports')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'recentReports' ? 'bg-white text-blue-800' : 'bg-blue-700 text-white'
              }`}
            >
              <History className="w-4 h-4 mr-2" />
              Recent Reports
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection('viewAllReports')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'viewAllReports' ? 'bg-white text-blue-800' : 'bg-blue-700 text-white'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              All Reports
            </motion.button>
          </nav>
        </div>
      </motion.header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            {activeSection === 'home' && (
            <div
            className="relative w-full min-h-screen flex flex-col justify-center items-center text-center text-white"
            style={{
              backgroundImage: "url('kris.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              margin: "0",
              padding: "0",
              bottom:"10px",
              left: "0",
              right: "0",
              position: "absolute", 
            }}
          >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
             <div className="relative z-10">
               <h1 className="text-4xl font-bold mb-6">Welcome to SKASC Report Management</h1>
               <p className="text-xl mb-8">Create and manage your reports efficiently</p>
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setActiveSection('eventReport')}
                 className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               >
                 Create New Report
               </motion.button>
             </div>
           </div>           
            )}
            {activeSection === 'eventReport' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveForm('form1')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      activeForm === 'form1'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Personal Information
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveForm('form2')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      activeForm === 'form2'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Event Details
                  </motion.button>
                </div>

                {!preview && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {activeForm === 'form1' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>                      
                        <div className="space-y-4">
                          <input
                            type="file"
                            name="photo"
                            onChange={handleFileChange}
                            className="w-full"
                            accept="image/*"
                          />
                          {photoPreview && (
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="max-w-xs rounded-lg shadow-md"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <textarea
                          name="objective"
                          placeholder="Objective"
                          value={formData.objective}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                        />
                        <textarea
                          name="report"
                          placeholder="Report"
                          value={formData.report}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                        />
                      </div>
                    )}
                    {activeForm === 'form2' && (
                      <div className="space-y-6">
                        <input
                          type="text"
                          name="eventName"
                          placeholder="Event Name"
                          value={formData.eventName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <input
                            type="date"
                            name="dateFrom"
                            value={formData.dateFrom}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="date"
                            name="dateTo"
                            value={formData.dateTo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                      {loading ? 'Please wait...' : 'Submit'}
                    </motion.button>
                  </motion.div>
                )}
                {preview && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-center">Preview</h2>
                    <ReportCard report={formData} />
                    <div className="flex gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFinalSubmit}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Confirm & Submit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPreview(false)}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Back
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            {activeSection === 'recentReports' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Recent Reports</h2>
                {reports.slice(-5).map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
            {activeSection === 'viewAllReports' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">All Reports</h2>
                {reports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
  };
  export default App;