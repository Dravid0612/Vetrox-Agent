import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Gavel, ArrowRight, Lock } from 'lucide-react';

const LoginGateway = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="z-10 max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Card 1: Policyholder (User) */}
        <div 
          onClick={() => navigate('/user')}
          className="group cursor-pointer bg-gray-900 border border-gray-800 hover:border-cyan-500 p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          <div className="bg-cyan-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-white">Policyholder</h2>
          <p className="text-gray-400 mb-6">Submit claims for instant AI analysis and automatic payout.</p>
          <div className="flex items-center text-cyan-400 font-bold group-hover:translate-x-2 transition-transform">
            ENTER PORTAL <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </div>

        {/* Card 2: DAO Admin */}
        <div 
          onClick={() => navigate('/admin')}
          className="group cursor-pointer bg-gray-900 border border-gray-800 hover:border-purple-500 p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        >
          <div className="bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
            <Gavel className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-white">DAO Council</h2>
          <p className="text-gray-400 mb-6">Review contested claims, vote on governance, and override AI decisions.</p>
          <div className="flex items-center text-purple-400 font-bold group-hover:translate-x-2 transition-transform">
            ACCESS TERMINAL <Lock className="ml-2 w-4 h-4" />
          </div>
        </div>

      </div>

      <div className="absolute bottom-8 text-center text-gray-600 text-sm">
        VETROX DECENTRALIZED INSURANCE PROTOCOL v1.0
      </div>
    </div>
  );
};

export default LoginGateway;