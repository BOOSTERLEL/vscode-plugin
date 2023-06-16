#include <stdbool.h>

extern void broadcast();
char* getchar(){    return "/0 ";   };
extern void MAYALIAS(void* p, void* q);
int main(){
    bool loopCondition = true;
    bool BranchCondition = true;
    char* secretToken = getchar();
    while(loopCondition){
        if(BranchCondition){
            char* a = secretToken;
            broadcast(a);
            MAYALIAS(a,secretToken);
        }
        else{
            char* b = "hello";
        }
    }
}
