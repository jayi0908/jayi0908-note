# 余切联合技术

::: Note collapse 实际上的“余切联合”
常说的是余切联合定理，实际上有很多表述形式，本节所提到的是笔者摸索出来的一种强力工具，只不过因为同样使用了余切作为关键要素，故将其也称为“余切联合技术”. 
:::

余切联合技术是刻画一个角度的特殊方式，由于平面几何中角度不会超过 180 度，所以<span style="color:red;">证明角相等实际上只需要证明余切相等</span>. 基于此，我们可以给出余切联合技术来获得一个角度的余切值： 

::: thm 余切联合定理
$\triangle A B C$ 满足：$b,c,A$ 已知，则 $B,C$ 的余切均可用 $b,c,A$ 表示.  
    
其三角等价形式为：
$$ \frac{\sin(\theta-\alpha)}{\sin \theta}=\lambda \Rightarrow \cot \theta=\frac{\cos \alpha-\lambda}{\sin \alpha}. $$
:::
    
---

::: proof collapse 定理之证明
证明是简单的，注意到 
$$\dfrac{\sin(\theta-\alpha)}{\sin \theta}=\dfrac{\sin \theta \cos \alpha-\sin \alpha \cos \theta}{\sin \theta}=\cos \alpha-\sin \alpha \cot \theta$$ 
即可.
:::

---



::: Tip 余切联合技术的优越性
余切联合技术的优点在于它可以将一个角的大小和已有的参数进行直接绑定，从而使这个角可以脱离整体图形——换句话说，我们只需要刻画好<span style="color:red;">这个角度所在的局部</span>，而不是选择用构造相似等等需要灵感和技巧的手法去使这个角和别的部分产生联系. 
     
某种程度上，这也是我们能够使用三角法而放弃辅助线的重要原因——**角度的余切就是我们的辅助线**. 
::: 