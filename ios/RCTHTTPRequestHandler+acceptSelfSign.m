//
//  RCTHTTPRequestHandler+acceptSelfSign.m
//  Based off : https://stackoverflow.com/a/41703745/1646117
//

#import <React/RCTBridgeModule.h>
#import <React/RCTHTTPRequestHandler.h>

@implementation RCTHTTPRequestHandler(acceptSelfSign)
// This method will override the default cert behaviour to accept self signed certs.
// Using RN Bridge modules this class will automatically be grabbed by React Native at build time. 
- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential *credential))completionHandler
{
  completionHandler(NSURLSessionAuthChallengeUseCredential, [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust]);
}
@end
