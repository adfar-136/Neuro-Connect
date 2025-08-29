import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, MessageCircle, Users, Calendar, Shield, Heart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleAIChat = () => {
    navigate('/ai-chat');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Mental Wellness
                <span className="block text-emerald-600">Journey Starts Here</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Find support, guidance, and resources tailored for students. 
                Connect with counsellors, explore helpful resources, and 
                access helpful services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 text-center"
                >
                  Join the event
                </Link>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>July 13th, 2025 10:00 AM</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-emerald-100 rounded-3xl p-8">
                <img 
                  src="https://images.pexels.com/photos/7551659/pexels-photo-7551659.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Mental Health Support Group" 
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive mental health support for students</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* AI Chat Service */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Mental Health Chat</h3>
                  <p className="text-gray-600 mb-6">Get instant support with our AI-powered mental health companion. Available 24/7 for confidential support.</p>
                  <button 
                    onClick={handleAIChat}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Start Chat
                  </button>
                </div>
                <div className="bg-orange-100 rounded-2xl p-4">
                  <img 
                    src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300" 
                    alt="AI Chat Bot" 
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Talk to a Counsellor */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Talk to a Counsellor</h3>
                  <p className="text-gray-600 mb-6">Connect with experienced counsellors for personalized guidance.</p>
                  <Link 
                    to="/register"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="bg-emerald-100 rounded-2xl p-4">
                  <img 
                    src="https://images.pexels.com/photos/7551640/pexels-photo-7551640.jpeg?auto=compress&cs=tinysrgb&w=300" 
                    alt="Counsellor Session" 
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Neuro Connect?</h2>
            <p className="text-xl text-gray-600">Your mental wellness is our priority</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">Your privacy and confidentiality are our top priorities</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Counsellors</h3>
              <p className="text-gray-600">Connect with verified and experienced mental health professionals</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Access mental health resources and support whenever you need</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Mental Wellness Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of students who have found support and guidance through Neuro Connect
          </p>
          <Link
            to="/register"
            className="bg-white hover:bg-gray-100 text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;