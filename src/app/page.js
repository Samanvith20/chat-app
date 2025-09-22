"use client"
import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Zap, Code, Database, Shield, Globe, CheckCircle, Star, ArrowRight, Github, ExternalLink, Play, Award, TrendingUp, Layers } from 'lucide-react';
import Link from 'next/link';

const ChatProjectShowcase = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const projectStats = [
    { label: 'Response Time', value: '<100ms', icon: '⚡' },
    { label: 'Concurrent Users', value: '100+', icon: '👥' },
    { label: 'Messages/sec', value: '500+', icon: '💬' },
    { label: 'Active Features', value: '4/7', icon: '🚀' }
  ];

  const techStack = [
    { name: 'Node.js + Express', desc: 'RESTful API with real-time endpoints', color: 'bg-green-500', status: 'completed' },
    { name: 'Socket.IO', desc: 'WebSocket connections for instant messaging', color: 'bg-yellow-500', status: 'completed' },
    { name: 'Firebase Auth', desc: 'Secure user authentication & authorization', color: 'bg-orange-500', status: 'completed' },
    { name: 'MongoDB', desc: 'Document-based message & user storage', color: 'bg-emerald-500', status: 'completed' },
    { name: 'Redis', desc: 'Caching & real-time user presence', color: 'bg-red-500', status: 'completed' },
    { name: 'Kafka', desc: 'Message streaming & event processing', color: 'bg-blue-500', status: 'planned' }
  ];

  const features = [
    { 
      icon: Shield, 
      title: 'Secure Authentication', 
      desc: 'Firebase-powered login with email & password',
      status: 'Completed',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/20'
    },
    { 
      icon: Zap, 
      title: 'Real-time Messaging', 
      desc: 'Instant message delivery with Socket.IO',
      status: 'Completed',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/20'
    },
    { 
      icon: Users, 
      title: 'Online Presence', 
      desc: 'Live user status with Redis integration',
      status: 'Completed',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/20'
    },
    { 
      icon: CheckCircle, 
      title: 'Message Status', 
      desc: 'Read receipts and delivery confirmations',
      status: 'In Progress',
      statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
    }
  ];

  const achievements = [
    '🚀 Core Chat Functionality Complete',
    '🔒 Firebase Authentication Integrated',
    '⚡ Real-time Socket.IO Communication',
    '💬 Message Delivery System Working',
    '📱 Mobile-Responsive Design',
    '🔧 Redis Integration - Complete'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % projectStats.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-blue-400/30">
            <Code className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Project in Active Development</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Real-Time
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Chat App
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A real-time chat application currently under development with modern technologies.
            <br />
            <span className="text-purple-400 font-semibold">Socket.IO • Firebase • MongoDB • Redis • Kafka (Coming Soon)</span>
          </p>

          {/* Live Stats */}
          {/* <div className="mb-12">
            <div className="inline-flex items-center gap-6 bg-black/20 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/10">
              <div className="text-center">
                <div className="text-3xl mb-2">{projectStats[currentStat].icon}</div>
                <div className="text-2xl font-bold text-white">{projectStats[currentStat].value}</div>
                <div className="text-sm text-gray-400">{projectStats[currentStat].label}</div>
              </div>
            </div>
          </div> */}

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/chat">
            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105">
              <Play className="w-6 h-6 group-hover:animate-bounce" />
              View Current Progress
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
            
                          <Link href="https://github.com/Samanvith20">
            <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 border border-white/20 hover:border-white/30">
              <Github className="w-6 h-6" />
              View Source Code
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-24 px-4 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Development Progress
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Core features completed, advanced features in active development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:bg-white/10 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4">{feature.desc}</p>
                <div className={`inline-flex items-center gap-2 ${feature.statusColor} rounded-full px-3 py-1 text-sm font-medium border`}>
                  {feature.status === 'Completed' ? <CheckCircle className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                  {feature.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className={`py-24 px-4 bg-black/20 backdrop-blur-sm transition-all duration-1000 ${isVisible.tech ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r  from-white to-gray-300 bg-clip-text text-transparent">
              Technology Stack Used
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Modern technologies implemented with best practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`w-4 h-4 ${tech.color} rounded-full mt-2 flex-shrink-0`}></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{tech.name}</h3>
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                        tech.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : tech.status === 'in-progress' 
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {tech.status === 'completed' ? '✓' : tech.status === 'in-progress' ? '⏳' : '📋'}
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{tech.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className={`py-24 px-4 transition-all duration-1000 ${isVisible.achievements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Current Milestones
            </h2>
            <p className="text-xl text-gray-400">
              What`s been accomplished so far
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
              >
                <Award className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-200 font-medium text-lg">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section id="architecture" className={`py-24 px-4 bg-black/20 backdrop-blur-sm transition-all duration-1000 ${isVisible.architecture ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Project Architecture
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Layers className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Frontend</h3>
              <p className="text-gray-400">React.js with responsive design, Socket.IO client integration, and Firebase Auth UI</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Database className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Backend</h3>
              <p className="text-gray-400">Node.js REST API with Socket.IO server, MongoDB database, Redis integration in progress</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">DevOps</h3>
              <p className="text-gray-400">Local development setup complete, deployment and testing infrastructure planned</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Development in Progress
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Core chat functionality is working! Advanced features like Redis caching, Kafka streaming, testing, and deployment coming soon.
            </p>
            
            <div className="flex items-center justify-center gap-8 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Core Features Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-yellow-400" />
                <span>Advanced Features WIP</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/chat">
                <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105">
                  <ExternalLink className="w-6 h-6 group-hover:animate-bounce" />
                  View Current Version
                </button>
              </Link>
               
              <Link href="https://github.com/Samanvith20">
                <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 border border-white/20 hover:border-white/30">
                  <Github className="w-6 h-6" />
                  Follow Development
                </button>
              </Link>
            </div>

            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
              <p className="text-yellow-200 text-center">
                <span className="font-semibold">Coming Soon:</span> Redis integration, Kafka streaming, comprehensive testing suite, and production deployment
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatProjectShowcase;