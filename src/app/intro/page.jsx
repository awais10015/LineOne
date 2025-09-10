"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  MessageCircle,
  TrendingUp,
  PenSquare,
  Zap,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  useEffect(() => {
    // Load GSAP
    const loadGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".curly-arrow-path",
        {
          strokeDasharray: "0,1000",
          opacity: 0,
        },
        {
          strokeDasharray: "6,6",
          opacity: 1,
          duration: 3,
          ease: "power2.out",
          delay: 0.8,
        }
      );

      gsap.fromTo(
        ".curly-arrow-head",
        {
          strokeDasharray: "0,100",
          opacity: 0,
          scale: 0,
        },
        {
          strokeDasharray: "2,0",
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(2.5)",
          delay: 3.2,
        }
      );

      gsap.to(".curly-animated-arrow", {
        y: -8,
        x: 3,
        rotation: 2,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.fromTo(
        ".dashboard-screenshot",
        { x: 100, opacity: 0, scale: 0.8 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: ".dashboard-screenshot",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".analytics-card",
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".analytics-card",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".feature-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".stat-number",
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="border-b border-orange-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Image src={"/logo.svg"} height={50} width={50} alt="logo"  />
              </div>
              <span className="font-bold text-xl text-gray-900">LineOne</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-600 hover:text-[#ff6500] transition-colors duration-300 hover:scale-105"
              >
                Home
              </a>
              <a
                href="#features"
                className="text-gray-600 hover:text-[#ff6500] transition-colors duration-300 hover:scale-105"
              >
                Features
              </a>
              <Button
                variant="outline"
                className="mr-2 cursor-pointer text-black hover:text-[#ff6500] shadow-[#ff6500]/20 bg-transparent border-orange-200 hover:bg-orange-50 hover:border-[#ff9100] hover:scale-105 transition-all duration-300"
                onClick={() => router.push("/login")}
              >
                Explore
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#ff6500]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-[#ff6500]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-[#ff6500]/40 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <svg
          className="absolute top-24 left-1/2 transform -translate-x-16 w-64 h-48 text-[#ff6500] curly-animated-arrow z-10"
          fill="none"
          viewBox="0 0 240 180"
        >
          <defs>
            <filter id="curly-glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Curly arrow path that loops and points to dashboard */}
          <path
            className="curly-arrow-path"
            d="M40 80 Q80 40 120 60 Q160 80 180 50 Q200 20 220 40 Q240 60 210 90 Q180 120 200 140"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="0,1000"
            fill="none"
            filter="url(#curly-glow)"
            strokeLinecap="round"
          />
          {/* Arrow head pointing toward dashboard */}
          <g
            className="curly-arrow-head"
            transform="translate(200, 140) rotate(45)"
          >
            <path
              d="M-10 -8 L0 0 L-10 8"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray="0,100"
              filter="url(#curly-glow)"
              strokeLinecap="round"
            />
            <circle cx="0" cy="0" r="4" fill="currentColor" opacity="0.9" />
          </g>
          {/* Floating text label */}
          <text
            x="120"
            y="30"
            className="text-sm font-semibold fill-current opacity-90"
            textAnchor="middle"
          >
            Live Preview ✨
          </text>
        </svg>

        <svg
          className="absolute top-60 right-1/4 w-32 h-20 text-teal-300/50"
          fill="none"
          viewBox="0 0 120 80"
        >
          <path
            d="M20 40 Q60 20 100 40"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="3,3"
            fill="none"
          />
          <path
            d="M95 35 L100 40 L95 45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#ff6500] px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors duration-300">
                <Star className="w-4 h-4" />
                <span>Join 50K+ Community Builders</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Building Community
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6500] to-[#ff2600] hover:from-[#ff6500] hover:to-[#ff3c00] transition-all duration-300">
                  That Actually Connect
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Create thriving community with real-time engagement and tools
                that bring people together naturally.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#ff6500] cursor-pointer hover:bg-[#ff6500] text-lg px-8 py-4 h-auto group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-orange-200"
                  onClick={() => router.push("/login")}
                >
                  Join Us Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 text-black hover:text-black shadow-[#ff6500]/20 shadow-2xl cursor-pointer py-4 h-auto border-orange-300 hover:bg-orange-50 bg-transparent hover:border-orange-400 hover:scale-105 transition-all duration-300"
                  onClick={() => router.push("/login")}
                >
                  See Live Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="w-5 h-5 text-[#ff6500]" />
                  <span className="text-sm text-gray-600">Free to start</span>
                </div>
                <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="w-5 h-5 text-[#ff6500]" />
                  <span className="text-sm text-gray-600">No credit card</span>
                </div>
                <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="w-5 h-5 text-[#ff6500]" />
                  <span className="text-sm text-gray-600">
                    Setup in 2 minutes
                  </span>
                </div>
              </div>
            </div>

            <div className="relative dashboard-screenshot">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/20 to-orange-800/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:shadow-3xl hover:shadow-emerald-200/50">
                <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full hover:bg-red-500 transition-colors"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full hover:bg-green-500 transition-colors"></div>
                  </div>
                  <div className="text-sm text-[#ff6500] font-medium">
                    https://line-one-eosin.vercel.app/home
                  </div>
                </div>
                <img
                  src={"/projectdemo.png"}
                  alt="Link Together Dashboard"
                  className="w-full h-auto hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="absolute -top-6 -right-6 bg-[#ff6500] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-[#ff6500] hover:scale-110 transition-all duration-300">
                Live Preview ✨
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white border border-orange-200 px-3 py-2 rounded-lg shadow-lg hover:shadow-xl hover:border-orange-300 transition-all duration-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#ff6500] rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">
                    Real-time updates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <svg
          className="absolute top-20 left-20 w-20 h-16 text-orange-200 animate-pulse"
          fill="none"
          viewBox="0 0 80 60"
        >
          <path
            d="M10 30 Q40 10 70 30"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="2,2"
            fill="none"
          />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4 hover:bg-orange-200 transition-colors duration-300">
              <Zap className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to build thriving community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From creation to growth, we've got the tools that make community
              building effortless and engaging.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 features-grid">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group bg-gradient-to-br from-orange-50 to-white hover:from-orange-100 hover:to-orange-50 feature-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ff6500] to-[#ff4000] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-orange-200">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#ff6500] transition-colors">
                  Create Groups
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Launch your Group in minutes with our intuitive setup process
                  and powerful moderation tools.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group bg-gradient-to-br from-orange-50 to-white hover:from-orange-100 hover:to-orange-50 feature-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ff6500] to-[#ff3700] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-orange-200">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#ff6500] transition-colors">
                  Post & Engage
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Rich media posts, real-time discussions, and engagement tools
                  that keep your community active and growing.
                </p>
              </CardContent>
            </Card>

            {/* <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group bg-gradient-to-br from-orange-50 to-white hover:from-orange-100 hover:to-orange-50 feature-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ff6500] to-[#ff0000] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-orange-200">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-700 transition-colors">
                  AI-Powered Assistant
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  24/7 AI assistance for moderation, engagement insights, and
                  helping your community members connect better.
                </p>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-[#ff6500] to-[#ff9100] relative overflow-hidden stats-section">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white/20 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/20 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by community builders worldwide
            </h2>
            <p className="text-xl text-orange-100">
              Join the movement that's reshaping how people connect online
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-5xl font-bold text-white mb-2 group-hover:scale-125 transition-all duration-300 stat-number hover:text-orange-200">
                50+
              </div>
              <div className="text-orange-100 text-lg group-hover:text-white transition-colors">
                Active Groups
              </div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-white mb-2 group-hover:scale-125 transition-all duration-300 stat-number hover:text-orange-200">
                1000+
              </div>
              <div className="text-orange-100 text-lg group-hover:text-white transition-colors">
                Group Members
              </div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-white mb-2 group-hover:scale-125 transition-all duration-300 stat-number hover:text-orange-200">
                6000+
              </div>
              <div className="text-orange-100 text-lg group-hover:text-white transition-colors">
                Posts Added
              </div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-white mb-2 group-hover:scale-125 transition-all duration-300 stat-number hover:text-orange-200">
                99.9%
              </div>
              <div className="text-orange-100 text-lg group-hover:text-white transition-colors">
                Uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:bg-orange-200 transition-colors duration-300">
                <TrendingUp className="w-4 h-4" />
                <span>Advanced Analytics</span>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for scale, designed for simplicity
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Whether you're creating your first Post or managing your Groups,
                LineOne grows with you.
              </p>

              <div className="space-y-6">
                {/* Create & Share Posts */}
                <div className="flex items-start space-x-4 group hover:bg-orange-50 p-4 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-300">
                    <PenSquare className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">
                      Create & Share
                    </h3>
                    <p className="text-gray-600">
                      Express yourself by creating posts, sharing thoughts, and
                      connecting with your community in real time.
                    </p>
                  </div>
                </div>

                {/* Chat & Group Chat */}
                <div className="flex items-start space-x-4 group hover:bg-orange-50 p-4 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-300">
                    <MessageCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">
                      Chat & Group Chats
                    </h3>
                    <p className="text-gray-600">
                      Stay connected with private chats or join group
                      conversations for lively discussions with friends.
                    </p>
                  </div>
                </div>

                {/* Follow & Interact */}
                <div className="flex items-start space-x-4 group hover:bg-orange-50 p-4 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-300">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">
                      Follow & Interact
                    </h3>
                    <p className="text-gray-600">
                      Build your network by following people, liking posts, and
                      leaving comments to spark meaningful interactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative analytics-card">
              <div className="absolute -inset-4 bg-gradient-to-br from-orange-200/30 to-orange-200/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-orange-100 p-8 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:shadow-3xl hover:shadow-orange-200/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Community Growth
                  </h3>
                  <span className="text-sm text-orange-600 font-medium bg-orange-100 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors">
                    +24% this month
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-300">
                    <span className="text-sm text-gray-600">New Members</span>
                    <span className="font-bold text-[#ff6500]">1,247</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-300">
                    <span className="text-sm text-gray-600">
                      Active Discussions
                    </span>
                    <span className="font-bold text-orange-600">89</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-300">
                    <span className="text-sm text-gray-600">
                      Engagement Rate
                    </span>
                    <span className="font-bold text-orange-600">94%</span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce hover:bg-[#ff6500] transition-colors">
                📈 Growing Fast!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#ff8400] via-[#ff6500] to-[#ff5100] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to share something amazing?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of community builders who trust LineOne to
            bring people together and create lasting connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg cursor-pointer px-8 py-4 h-auto bg-white text-[#ff6500] hover:bg-orange-50 group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-orange-200"
              onClick={() => router.push("/login")}
            >
              Join LineOne
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-white/90 italic mb-3">
              "LineOne transformed how we connect with our community.
              Setup was incredibly easy!"
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <span className="text-white/80 text-sm">
                Sarah Chen, Frontend Dev Community
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                   <Image src={"/logo.svg"} height={50} width={50} alt="logo"  />
                </div>
                <span className="font-bold text-xl">LinOne</span>
              </div>
              <p className="text-gray-400">
                Building community, connecting people, creating conversations
                that matter.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LineOne. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
