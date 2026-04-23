import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Youtube, Users, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useYoutube } from "@/hooks/useYoutube";
import type { YoutubeChannel } from "@/lib/api/youtube";

const ERROR_MESSAGES: Record<string, string> = {
  authorization_code_missing: "Authorization failed. Please try again.",
  user_id_missing: "Session error. Please log in again.",
  user_not_found: "User not found. Please log in again.",
  no_youtube_channels_found: "No YouTube channels found on this Google account.",
  oauth_callback_failed: "Google connection failed. Please try again.",
};

function formatError(code: string): string {
  return ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.";
}

export default function SelectYoutubeChannel() {
  const navigate = useNavigate();
  const { setCreatorIncomeConnected } = useAuth({ autoAuthenticate: false });
  const { syncChannel, syncing } = useYoutube();

  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const err = params.get("error");
    if (err) {
      setError(formatError(err));
      return;
    }

    const channelsParam = params.get("channels");
   
    if (channelsParam) {
      try {
        // URLSearchParams.get() already URL-decodes, so just parse the JSON directly
        const parsed = JSON.parse(channelsParam);
       setChannels(Array.isArray(parsed) ? parsed : []);
      } catch {
        setError("Failed to parse channel data.");
      }
    }
  }, []);

  const handleSelectChannel = async (channelId: string) => {
    setSelectedChannelId(channelId);
    const success = await syncChannel(channelId);
    if (success) {
      setCreatorIncomeConnected(true);
      navigate("/onboarding/creator");
    } else {
      setSelectedChannelId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Youtube className="h-6 w-6 text-red-500" />
            <h1 className="font-display text-2xl font-bold">Select Your YouTube Channel</h1>
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Choose the channel you want to connect to your creator account.
          </p>
        </div>

        {error && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="pt-6 space-y-4">
              <p className="font-body text-sm text-red-400">{error}</p>
              <Button
                onClick={() => navigate("/onboarding/creator")}
                variant="outline"
                className="w-full font-body font-semibold"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!error && channels.length > 0 && (
          <div className="space-y-3">
            {channels.map((channel) => (
              <Card
                key={channel.channelId}
                className="border-white/10 bg-card/40 backdrop-blur-md"
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={channel.channelThumbnail}
                      alt={channel.channelName}
                      className="h-14 w-14 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm truncate">
                        {channel.channelName}
                      </p>
                      <p className="font-body text-xs text-muted-foreground truncate">
                        {channel.channelHandle}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {Number(channel.subscriberCount).toLocaleString()}
                        </span>
                        {channel.likelyMonetized ? (
                          <span className="flex items-center gap-1 text-xs text-creo-teal">
                            <CheckCircle2 className="h-3 w-3" />
                            Monetized
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <XCircle className="h-3 w-3" />
                            Not Monetized
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSelectChannel(channel.channelId)}
                      disabled={syncing}
                      size="sm"
                      className="flex-shrink-0 bg-gradient-hero font-body font-semibold text-primary-foreground hover:opacity-90"
                    >
                      {syncing && selectedChannelId === channel.channelId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!error && channels.length === 0 && (
          <Card className="border-white/10 bg-card/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="font-display text-lg">No Channels Found</CardTitle>
              <CardDescription className="font-body text-sm">
                No YouTube channels were found on your Google account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/onboarding/creator")}
                variant="outline"
                className="w-full font-body font-semibold"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
