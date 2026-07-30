import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Play, Check, Star, Zap, Shield, Clock, Globe,
  FileText, Minimize2, Split, Merge, Edit, Lock, Unlock,
  Eye, RotateCw, Download, Upload, Trash2, FilePlus,
  ChevronDown, ChevronRight, Sparkles, Layers
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const float = {
  y: [-10, 10, -10],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
}

// Popular Tools Data
const popularTools = [
  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into a single file',
    icon: Merge,
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    popular: true
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce file size while maintaining quality',
    icon: Minimize2,
    color: 'from-purple-500 to-pink-400',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    popular: true
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract pages or split into multiple files',
    icon: Split,
    color: 'from-orange-500 to-red-400',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    popular: true
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert PDF pages to high-quality images',
    icon: FileText,
    color: 'from-green-500 to-emerald-400',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    popular: true
  },
]

// All Tools Categories
const toolCategories = [
  {
    title: 'Convert',
    tools: [
      { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: FileText },
      { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: FilePlus },
      { id: 'word-to-pdf', name: 'Word to PDF', icon: FileText },
      { id: 'pdf-to-word', name: 'PDF to Word', icon: FileText },
    ]
  },
  {
    title: 'Organize',
    tools: [
      { id: 'merge', name: 'Merge PDF', icon: Merge },
      { id: 'split', name: 'Split PDF', icon: Split },
      { id: 'extract', name: 'Extract Pages', icon: Layers },
      { id: 'delete', name: 'Delete Pages', icon: Trash2 },
    ]
  },
  {
    title: 'Edit',
    tools: [
      { id: 'compress', name: 'Compress PDF', icon: Minimize2 },
      { id: 'rotate', name: 'Rotate Pages', icon: RotateCw },
      { id: 'watermark', name: 'Add Watermark', icon: Edit },
      { id: 'number', name: 'Page Numbers', icon: FileText },
    ]
  },
  {
    title: 'Security',
    tools: [
      { id: 'protect', name: 'Protect PDF', icon: Lock },
      { id: 'unlock', name: 'Unlock PDF', icon: Unlock },
      { id: 'sign', name: 'Sign PDF', icon: Edit },
      { id: 'redact', name: 'Redact Text', icon: Eye },
    ]
  },
]

// How It Works Steps
const howItWorks = [
  { number: '01', title: 'Upload Your File', description: 'Drag and drop or select your PDF from any device' },
  { number: '02', title: 'Choose Action', description: 'Select the tool or action you want to perform' },
  { number: '03', title: 'Download Result', description: 'Get your processed file instantly or via email' },
]

// Why Choose Us Features
const whyChooseUs = [
  { icon: Zap, title: 'Lightning Fast', description: 'Process files in seconds with our optimized cloud infrastructure', color: 'text-yellow-500' },
  { icon: Shield, title: 'Bank-Level Security', description: '256-bit SSL encryption with automatic file deletion after 1 hour', color: 'text-green-500' },
  { icon: Globe, title: 'Works Everywhere', description: 'Access from any device - desktop, tablet, or mobile', color: 'text-blue-500' },
  { icon: Clock, title: 'No Wait Time', description: 'Instant processing. No queues, no delays, no limits', color: 'text-purple-500' },
]

// Security Features
const securityFeatures = [
  { title: 'SSL Encryption', description: 'All file transfers are encrypted with 256-bit SSL' },
  { title: 'Auto-Delete', description: 'Files are automatically deleted within 1 hour of processing' },
  { title: 'No Storage', description: 'We never store your files on our servers' },
  { title: 'Privacy First', description: 'Your data never leaves your device unnecessarily' },
]

// Testimonials
const testimonials = [
  {
    quote: 'FileTools has completely transformed how I handle PDFs. The merge and split tools save me hours every week.',
    name: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechFlow',
    rating: 5
  },
  {
    quote: 'The security and speed are unmatched. I recommend FileTools to all my colleagues for any document needs.',
    name: 'Marcus Johnson',
    role: 'Lead Developer',
    company: 'CloudScale',
    rating: 5
  },
  {
    quote: 'Simple, fast, and secure. No sign-up needed for basic tools makes it incredibly accessible for everyone.',
    name: 'Elena Rodriguez',
    role: 'Freelance Designer',
    company: '',
    rating: 5
  },
]

// Pricing Plans
const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for occasional use',
    features: [
      'All basic tools',
      '50MB file limit',
      '2 files per day',
      'Standard speed',
      'No account required',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For power users',
    features: [
      'Everything in Free',
      '500MB file limit',
      'Unlimited files',
      'Priority speed',
      'Batch processing',
      'Cloud storage',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/month',
    description: 'For teams & businesses',
    features: [
      'Everything in Pro',
      '1GB file limit',
      'Team management',
      'API access',
      'Custom branding',
      'Dedicated support',
      'SSO integration',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

// FAQ Data
const faqs = [
  {
    question: 'Is FileTools free to use?',
    answer: 'Yes! Our basic tools are completely free. You can merge, split, compress, and convert PDFs without creating an account. We offer premium plans for advanced features like larger file sizes, batch processing, and priority support.'
  },
  {
    question: 'Are my files secure?',
    answer: 'Absolutely. We use 256-bit SSL encryption for all file transfers. Files are automatically deleted from our servers within 1 hour of processing. We never store or share your documents with anyone.'
  },
  {
    question: 'What file formats are supported?',
    answer: 'We support PDF, JPG, JPEG, PNG, DOC, DOCX, and many more formats. Our tools can convert between these formats seamlessly while maintaining quality.'
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No! FileTools is completely web-based. There\'s nothing to download or install. Just open your browser and start using our tools immediately.'
  },
  {
    question: 'What\'s the maximum file size?',
    answer: 'Free users can upload files up to 50MB. Premium subscribers enjoy up to 500MB file limits with faster processing speeds.'
  },
  {
    question: 'How long are my files stored?',
    answer: 'They\'re not! Files are processed in real-time and automatically deleted immediately after. We don\'t store any of your documents on our servers.'
  },
]

// Trusted Companies
const trustedCompanies = [
  'Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'Slack'
]

// Animated Drop Zone Component
function AnimatedDropZone() {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
  })

  return (
    <div {...getRootProps()} className="relative cursor-pointer">
      <input {...getInputProps()} />
      <motion.div
        animate={{
          scale: isDragActive ? 1.02 : 1,
          borderColor: isDragActive ? 'rgb(59, 130, 246)' : 'rgba(0,0,0,0.1)'
        }}
        className={`
          relative rounded-3xl border-2 border-dashed p-8 transition-all duration-300
          ${isDragActive ? 'bg-blue-50' : 'bg-white'}
          backdrop-blur-xl shadow-xl
        `}
      >
        <AnimatePresence mode="wait">
          {files.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-900 font-medium">{files[0].name}</p>
              <p className="text-gray-500 text-sm">Ready to process</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ y: isDragActive ? -5 : 0 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/25"
              >
                <Upload className="w-10 h-10 text-white" />
              </motion.div>
              <p className="text-gray-900 text-lg font-semibold mt-4">
                {isDragActive ? 'Drop your file here' : 'Drop PDF here'}
              </p>
              <p className="text-gray-500 text-sm mt-1">or click to browse</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Cards */}
      <motion.div
        animate={float}
        className="absolute -top-4 -right-8 p-3 rounded-2xl bg-white shadow-xl border border-gray-100 hidden md:block"
      >
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-xs text-gray-700 font-medium">Free</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ ...float, transition: { ...float.transition, delay: 0.5 } }}
        className="absolute -bottom-4 -left-8 p-3 rounded-2xl bg-white shadow-xl border border-gray-100 hidden md:block"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-xs text-gray-700 font-medium">Fast</span>
        </div>
      </motion.div>
    </div>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden pt-20 bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Private & Secure
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
              Transform Your
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Documents
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 text-xl text-gray-600 max-w-xl leading-relaxed">
              Merge, split, compress, and convert PDFs with ease.
              No sign-up required. Bank-grade security.
              Results in seconds.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-blue-500/20 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#tools"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                <Play className="w-5 h-5" />
                See How It Works
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap gap-8">
              {[
                { value: '10+', label: 'Tools' },
                { value: '500K+', label: 'Users' },
                { value: '10M+', label: 'Files Processed' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Drop Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <AnimatedDropZone />

            {/* Decorative Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' as const }}
              className="absolute -top-8 -right-8 w-32 h-32 border border-gray-200 rounded-full hidden lg:block"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' as const }}
              className="absolute -bottom-4 -left-4 w-24 h-24 border border-gray-200 rounded-full hidden lg:block"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Trusted Companies Section
function TrustedCompanies() {
  return (
    <section className="py-16 border-y border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 mb-8"
        >
          Trusted by teams at companies worldwide
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-12 opacity-40"
        >
          {trustedCompanies.map((company, i) => (
            <span key={i} className="text-2xl font-bold text-gray-900">{company}</span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Popular Tools Section
function PopularTools() {
  return (
    <section id="tools" className="py-24 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Most Popular
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
            Tools You Need
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Professional PDF tools that work directly in your browser. No downloads, no installation, no hassle.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {popularTools.map((tool, i) => {
            const Icon = tool.icon
            return (
              <motion.div
                key={tool.id}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative"
              >
                <div className={`
                  absolute inset-0 rounded-3xl bg-gradient-to-br ${tool.color} opacity-0
                  group-hover:opacity-10 transition-opacity duration-300 blur-xl
                `} />
                <Link to={`/tools/${tool.id}`}>
                  <div className={`
                    relative p-6 rounded-3xl border-2 bg-white backdrop-blur-sm
                    ${tool.borderColor} group-hover:border-gray-300 transition-all duration-300
                    h-full flex flex-col shadow-sm hover:shadow-lg
                  `}>
                    {tool.popular && (
                      <span className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-semibold text-white">
                        Popular
                      </span>
                    )}
                    <div className={`
                      w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color}
                      flex items-center justify-center mb-4 shadow-lg
                    `}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                    <p className="text-gray-600 text-sm flex-1">{tool.description}</p>
                    <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                      Open Tool <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
          >
            View All Tools <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// All Tools Categories Section
function ToolCategories() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-purple-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-bold text-gray-900">
            Every Tool You Need
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-xl text-gray-600">
            From basic conversions to advanced editing - we've got you covered
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {toolCategories.map((category, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h3>
              <div className="space-y-2">
                {category.tools.map((tool, j) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={j}
                      to={`/tools/${tool.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:shadow">
                        <Icon className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{tool.name}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-bold text-gray-900">
            How It Works
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-xl text-gray-600">
            Three simple steps to transform your documents
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative"
            >
              <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="text-6xl font-bold text-gray-200 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {i < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Why Choose Us Section
function WhyChooseUs() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[150px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-bold text-gray-900">
            Why Choose Us
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-xl text-gray-600">
            Built for speed, security, and simplicity
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-center group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Security Section
function SecuritySection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Bank-Level Security
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Your Files Are <br />
              <span className="text-green-600">100% Secure</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We take security seriously. Your documents are protected with
              enterprise-grade encryption and automatically deleted after processing.
            </p>
            <div className="space-y-4">
              {securityFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 text-center">
                  <div className="text-3xl font-bold text-green-600">256-bit</div>
                  <div className="text-sm text-gray-500">SSL Encryption</div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 text-center">
                  <div className="text-3xl font-bold text-blue-600">1 Hour</div>
                  <div className="text-sm text-gray-500">Auto Delete</div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 text-center">
                  <div className="text-3xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-500">Files Stored</div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 text-center">
                  <div className="text-3xl font-bold text-orange-500">100%</div>
                  <div className="text-sm text-gray-500">Private</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-bold text-gray-900">
            Loved by Users
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-xl text-gray-600">
            Join thousands of satisfied users worldwide
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pricing Section
function PricingSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-transparent to-purple-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-bold text-gray-900">
            Simple Pricing
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-xl text-gray-600">
            Start free, upgrade when you need more
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`
                relative p-8 rounded-3xl border-2 transition-all
                ${plan.popular
                  ? 'bg-white border-blue-500 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-gray-300'}
              `}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500">{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`
                w-full py-3 rounded-xl font-semibold transition-all
                ${plan.popular
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
              `}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-xl text-gray-600">
            Everything you need to know
          </motion.p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/20 to-transparent rounded-full blur-[100px]" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of users who trust FileTools for their document needs.
            Start for free, no credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all hover:shadow-xl hover:shadow-blue-500/20 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-600 bg-transparent text-white font-semibold hover:bg-gray-800 transition-all"
            >
              Browse All Tools
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Main HomePage Component
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <TrustedCompanies />
      <PopularTools />
      <ToolCategories />
      <HowItWorks />
      <WhyChooseUs />
      <SecuritySection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
