import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Home,
  Star,
  Flag,
  MessageCircle,
  CheckCircle,
  Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const OWNER_PROFILE = {
  name: 'Ahmed El-Sayed',
  avatar: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?w=400',
  email: 'ahmed.elsayed@example.com',
  phone: '+20 1098 765 432',
  location: 'Cairo, Egypt',
  joinDate: 'March 2022',
  bio: 'Experienced property owner with a portfolio of well-maintained apartments in downtown Cairo. I prioritize tenant satisfaction and maintain all properties to the highest standards. Quick to respond to maintenance requests and committed to providing comfortable living spaces.',
  verified: true,
  rating: 4.8,
  totalReviews: 45,
  properties: 8,
  responseTime: 'Within 2 hours',
};

const PROPERTIES = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    name: 'Modern Downtown Apartment',
    location: 'Cairo, Egypt',
    price: 28000,
    rating: 4.9,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400',
    name: 'Luxury Penthouse Suite',
    location: 'Cairo, Egypt',
    price: 45000,
    rating: 5.0,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
    name: 'Beachfront Condo',
    location: 'Alexandria, Egypt',
    price: 38000,
    rating: 4.7,
  },
];

export function ViewOwnerProfilePage() {
  const navigate = useNavigate();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleReport = () => {
    if (reportReason.trim()) {
      toast.success('Report submitted successfully. We will review it shortly.');
      setShowReportDialog(false);
      setReportReason('');
    } else {
      toast.error('Please provide a reason for reporting');
    }
  };

  const handleChatClick = () => {
    navigate('/messages');
    toast.success('Opening chat with owner...');
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[1200px] mx-auto px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-xl hover:bg-[#E5EBF0]/50"
        >
          ← Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardContent className="pt-6 text-center">
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={OWNER_PROFILE.avatar} />
                    <AvatarFallback className="text-4xl">
                      {OWNER_PROFILE.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {OWNER_PROFILE.verified && (
                    <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">{OWNER_PROFILE.name}</h2>
                <p className="text-sm text-[#6B7280] mb-4">Property Owner</p>

                {OWNER_PROFILE.verified && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
                    <CheckCircle className="w-4 h-4" />
                    Verified Owner
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                    <span className="font-bold text-[#1a1a1a]">{OWNER_PROFILE.rating}</span>
                  </div>
                  <span className="text-sm text-[#6B7280]">
                    ({OWNER_PROFILE.totalReviews} reviews)
                  </span>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <Mail className="w-4 h-4 text-[#3A6EA5]" />
                    <span className="truncate">{OWNER_PROFILE.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <Phone className="w-4 h-4 text-[#3A6EA5]" />
                    <span>{OWNER_PROFILE.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <MapPin className="w-4 h-4 text-[#3A6EA5]" />
                    <span>{OWNER_PROFILE.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <Calendar className="w-4 h-4 text-[#3A6EA5]" />
                    <span>Member since {OWNER_PROFILE.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <Building2 className="w-4 h-4 text-[#3A6EA5]" />
                    <span>{OWNER_PROFILE.properties} Properties</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#3A6EA5]/20 space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl"
                    onClick={handleChatClick}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Owner
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full rounded-xl bg-red-500 hover:bg-red-600"
                    onClick={() => setShowReportDialog(true)}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report Owner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a1a1a] leading-relaxed">{OWNER_PROFILE.bio}</p>
              </CardContent>
            </Card>

            {/* Owner Stats */}
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">Owner Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl text-center">
                    <p className="text-3xl font-bold text-[#3A6EA5] mb-1">
                      {OWNER_PROFILE.properties}
                    </p>
                    <p className="text-sm text-[#6B7280]">Total Properties</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                      <p className="text-3xl font-bold text-[#3A6EA5]">{OWNER_PROFILE.rating}</p>
                    </div>
                    <p className="text-sm text-[#6B7280]">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties */}
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Home className="w-6 h-6 text-[#3A6EA5]" />
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    Properties ({PROPERTIES.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {PROPERTIES.map((property) => (
                    <div
                      key={property.id}
                      className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-[#1a1a1a] mb-1">{property.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
                          <MapPin className="w-3 h-3" />
                          {property.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-[#3A6EA5]">
                            EGP {property.price.toLocaleString()}/mo
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                            <span className="text-sm font-medium text-[#1a1a1a]">
                              {property.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1a1a1a]">Report Owner</DialogTitle>
            <DialogDescription className="text-[#6B7280]">
              Please provide details about why you're reporting this owner. Our team will review your report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="report-reason" className="text-[#1a1a1a] mb-2 block">
                Reason for Reporting
              </Label>
              <Textarea
                id="report-reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue..."
                className="bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20 min-h-[120px]"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowReportDialog(false);
                setReportReason('');
              }}
              className="rounded-xl border-[#3A6EA5]/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReport}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}